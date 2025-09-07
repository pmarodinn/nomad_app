import { Href, Link } from 'expo-router';
import { type ComponentProps } from 'react';
import { Linking, Alert } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  const handlePress = async (event: any) => {
    event.preventDefault();
    
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(href);
    
    if (supported) {
      // Open the link in the device's default browser
      await Linking.openURL(href);
    } else {
      Alert.alert('Erro', `Não foi possível abrir o link: ${href}`);
    }
  };

  return (
    <Link
      {...rest}
      href={href}
      onPress={handlePress}
    />
  );
}
