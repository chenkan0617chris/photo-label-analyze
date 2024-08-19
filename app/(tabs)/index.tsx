import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {

  const [facing, setFacing] = useState<CameraType>('back');

  const [open, setOpen] = useState<boolean>(false);
  const [pic, setPic] = useState<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>();
  const navigation = useNavigation<any>();

  useEffect(() =>{
    return () => {
      init();
    }
  }, []);

  const init = () => {
    setOpen(false);
    setPic(undefined);
    setFacing('back');
  };

  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraOpen(){
    setOpen(current => !current);
  }

  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPic = await cameraRef.current.takePictureAsync(options);
    setPic(newPic);

    try {
      await AsyncStorage.setItem('pic', newPic.base64);
    } catch (e) {
      console.log(e);
    }
  };

  const analyze = async () => {
    // navigation.push('photo', { user: 'bacon' });

    // await FileSystem.copyAsync({
    //   from: pic,
    //   to: `../../assets/pics/1.jpg`
    // })
    
    navigation.navigate('photo');
    // init();
  };

  const retake = () => {
    setPic(undefined);
  };

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

    if(pic){
      // if took pic
      return <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: pic.base64 }}></Image>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button title="Analyze" onPress={analyze}></Button>
          </View>
          <View style={styles.button}>
            <Button title="Retake" onPress={retake}></Button>
          </View>
        </View>
      </SafeAreaView>
    }

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
          <View>
            <Button title="take pic" onPress={takePic}></Button>
          </View>
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
  btmButton: {
    margin: 16,
    
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
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
  preview: {
    alignSelf: 'stretch',
    flex: 1
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
    textAlign: 'center',
    marginTop: 32
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
    position: 'static'

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
