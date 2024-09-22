import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, Button, Dimensions } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, NavigationContainer, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { CHOICES } from '@/constants/constants';

export default function HomeScreen() {

  const [facing, setFacing] = useState<CameraType>('back');

  const [open, setOpen] = useState<boolean>(false);
  const [pic, setPic] = useState<any>();
  const [choices, setChoices] = useState<string>(CHOICES[0]);
  const [chooseFlag, setChooseFlag] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>();
  const navigation = useNavigation<any>();

  const windowWidth = Dimensions.get('window').width;

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

  const renderOptions = () => {
    console.log(choices);
    if(chooseFlag){
      return (
          <View style={styles.cameraBox}>
            <ThemedText>
              Your Choices: {choices}
            </ThemedText>
            <TouchableOpacity onPress={() => setChooseFlag(false)} style={{ marginBottom: 10 }}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Go back to setting</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View style={styles.cameraBorder}>
                <TabBarIcon style={{fontSize: 50}} name='camera-sharp' />
              </View>
            </TouchableOpacity>
          </View>
      );
    }
    return <View style={{ display: 'flex', alignItems: 'center' }}>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>Choose what you want to analyze:</ThemedText>
        <SegmentedControl
          style={{ height: 50, width: windowWidth * 0.9, marginBottom: 20 }}
          values={CHOICES}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setChoices(event.nativeEvent.value);
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <View style={{ width: windowWidth * 0.3, alignItems: 'center'  }}>
          <Button onPress={() => setChooseFlag(true)} title='Start'></Button>
        </View>
    </View>
  };

  const analyze = async () => {
    // navigation.push('photo', { user: 'bacon' });

    // MediaLibrary.saveToLibraryAsync(pic.uri).then(() => {
    //   setPic(undefined);
    // });

    // await FileSystem.copyAsync({
    //   from: pic,
    //   to: `../../assets/pics/1.jpg`
    // })
    
    navigation.navigate('photo');
    // init();
  };

  const retake = async () => {
    setPic(undefined);
    await AsyncStorage.clear();
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
          <View style={{ flex: 1 }}></View>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.takePic}>
              <TabBarIcon onPress={takePic} style={{fontSize: 50}} name='camera-sharp' />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggleCameraOpen}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
          {renderOptions()}
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
    marginTop: 32,
    position: 'absolute',
    top: 0
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
    position: 'static',
    alignItems: 'center'
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
  takePic: {
    borderWidth: 3,
    borderStyle: 'solid',
    borderRadius: 60,
    display: 'flex',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
