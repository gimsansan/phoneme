import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={"/(tabs)/sound_grt" as any} />;
}
