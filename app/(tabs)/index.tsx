import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

export default function HomeScreen() {

  const [facing, setFacing] = useState<CameraType>('back');

  const [open, setOpen] = useState<boolean>(false);

  const [permission, requestPermission] = useCameraPermissions();

  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraOpen(){
    setOpen(current => !current);
  }

  if(open){
    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraOpen}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
      <ThemedView style={styles.container}>
          <ThemedView style={styles.headerView}>
            <ThemedText style={styles.titleName} type='title'>GIAO</ThemedText>
            <ThemedText style={styles.subtitle} type='subtitle'>Your Graphical Identification and Analysis Online</ThemedText>
          </ThemedView>
          <View style={styles.cameraBox}>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View style={styles.cameraBorder}>
                <TabBarIcon style={{fontSize: 50}} name='camera-sharp' />
              </View>
            </TouchableOpacity>
          </View>
      </ThemedView>
      );
}

const styles = StyleSheet.create({
  cameraBorder: {
    width: 350,
    height: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8
  },
  cameraBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  titleName: {
    fontSize: 60,
    lineHeight: 60,
    textAlign: 'center',
    margin: 16
  },
  subtitle: {
    textAlign: 'center',
    margin: 16
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#A1CEDC',
    backgroundColor: '#D0D0D0',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin: 16
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
