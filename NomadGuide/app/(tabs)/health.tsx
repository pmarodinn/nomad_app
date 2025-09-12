import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, TextInput, Dialog, Portal, List, Switch } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { Timestamp, addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where, orderBy } from 'firebase/firestore';
import { firestore } from '@/src/config/firebase';
import { useAuth } from '@/src/contexts/AuthContext';

interface MedicationDoc {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string; // ex: '24h'
  nextDose: Date;
  isActive: boolean;
  notificationId?: string;
  createdAt: Date;
}

const medicationsCol = collection(firestore, 'medications');

async function scheduleMedicationNotification(name: string, date: Date, dosage: string) {
  const hasPerm = await ensureNotificationPermission();
  if (!hasPerm) return undefined;
  const seconds = Math.max(1, Math.floor((date.getTime() - Date.now()) / 1000));
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora do medicamento',
      body: `${name} (${dosage})`,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: { seconds, repeats: false } as any,
  });
}

async function ensureNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    return req.status === 'granted';
  }
  return true;
}

export default function HealthScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<MedicationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<MedicationDoc | null>(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [hours, setHours] = useState('24');
  const [firstDose, setFirstDose] = useState(() => new Date(Date.now() + 60 * 60 * 1000));
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      medicationsCol,
      where('userId', '==', user.id),
      orderBy('nextDose', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      const data: MedicationDoc[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any),
        nextDose: (d.data().nextDose as Timestamp).toDate(),
        createdAt: (d.data().createdAt as Timestamp).toDate(),
      }));
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const resetForm = () => {
    setEditing(null);
    setName('');
    setDosage('');
    setHours('24');
    setFirstDose(new Date(Date.now() + 60 * 60 * 1000));
    setActive(true);
  };

  const openNew = () => {
    resetForm();
    setDialogVisible(true);
  };

  const openEdit = (med: MedicationDoc) => {
    setEditing(med);
    setName(med.name);
    setDosage(med.dosage);
    const freq = parseInt(med.frequency.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(freq)) setHours(String(freq));
    setFirstDose(med.nextDose);
    setActive(med.isActive);
    setDialogVisible(true);
  };

  const save = useCallback(async () => {
    if (!user || !name.trim() || !dosage.trim()) return;
    const freqHours = parseInt(hours, 10) || 24;
    const nextDoseDate = firstDose;

    let notificationId: string | undefined;
    if (active) {
      notificationId = await scheduleMedicationNotification(name.trim(), nextDoseDate, dosage.trim());
    }

    if (editing) {
      await updateDoc(doc(medicationsCol, editing.id), {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: `${freqHours}h`,
        nextDose: Timestamp.fromDate(nextDoseDate),
        isActive: active,
        notificationId: notificationId || editing.notificationId || null,
      });
    } else {
      await addDoc(medicationsCol, {
        userId: user.id,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: `${freqHours}h`,
        nextDose: Timestamp.fromDate(nextDoseDate),
        isActive: active,
        notificationId: notificationId || null,
        createdAt: Timestamp.now(),
      });
    }
    setDialogVisible(false);
    resetForm();
  }, [user, name, dosage, hours, firstDose, active, editing]);

  const remove = async (id: string) => {
    await deleteDoc(doc(medicationsCol, id));
  };

  const markTaken = async (med: MedicationDoc) => {
    const freqHours = parseInt(med.frequency.replace(/[^0-9]/g, ''), 10) || 24;
    const next = new Date(Date.now() + freqHours * 60 * 60 * 1000);
    let notificationId: string | undefined;
    if (med.isActive) {
      notificationId = await scheduleMedicationNotification(med.name, next, med.dosage);
    }
    await updateDoc(doc(medicationsCol, med.id), {
      nextDose: Timestamp.fromDate(next),
      notificationId: notificationId || med.notificationId || null,
    });
  };

  const renderItem = ({ item }: { item: MedicationDoc }) => {
    const timeLeftMs = item.nextDose.getTime() - Date.now();
    const hoursLeft = Math.max(0, Math.floor(timeLeftMs / (1000 * 60 * 60)));
    const minsLeft = Math.max(0, Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60)));
    return (
      <List.Item
        title={`${item.name} (${item.dosage})`}
        description={`Próxima: ${item.nextDose.toLocaleTimeString()} • Em ${hoursLeft}h ${minsLeft}m`}
        left={props => <List.Icon {...props} icon={item.isActive ? 'pill' : 'pause'} />}
        right={props => (
          <View style={styles.row}>
            <Button compact onPress={() => markTaken(item)}>Tomado</Button>
            <Button compact onPress={() => openEdit(item)}>Editar</Button>
            <Button compact onPress={() => remove(item.id)} color="red">X</Button>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Medicamentos" />
        <Appbar.Action icon="plus" onPress={openNew} />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Agenda</Title>
          {loading ? <Paragraph>Carregando...</Paragraph> : (
            <FlatList
              data={items}
              keyExtractor={i => i.id}
              renderItem={renderItem}
              ListEmptyComponent={<Paragraph>Nenhum medicamento.</Paragraph>}
            />
          )}
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{editing ? 'Editar' : 'Novo'} Medicamento</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Nome" value={name} onChangeText={setName} style={styles.input} />
            <TextInput label="Dosagem" value={dosage} onChangeText={setDosage} style={styles.input} />
            <TextInput label="Frequência (horas)" value={hours} onChangeText={setHours} keyboardType="numeric" style={styles.input} />
            <Paragraph>Primeira dose: {firstDose.toLocaleString()}</Paragraph>
            <View style={styles.rowBetween}>
              <Paragraph>Ativar lembrete</Paragraph>
              <Switch value={active} onValueChange={setActive} />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setDialogVisible(false); resetForm(); }}>Cancelar</Button>
            <Button onPress={save}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { margin: 16 },
  input: { marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});
