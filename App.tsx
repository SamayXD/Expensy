import React, { Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
import { SQLiteProvider } from 'expo-sqlite';
import Home from './screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator()

const loadDatabase = async () =>{
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("./assets/mySQLiteDB.db")
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;


  const fileInfo = await FileSystem.getInfoAsync(dbFilePath)
  if(!fileInfo.exists){
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,{
        intermediates : true
      }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

export default function App() {
  const [dbLoaded, setDbLoaded] = useState<boolean>(false)

  useEffect(()=>{
      loadDatabase().then(()=>{
        setDbLoaded(true)
      }).catch((e)=>console.log("ERROR: ",e))
  },[])

  if(!dbLoaded){
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems : "center"}}>
        <ActivityIndicator size={"large"} />
        <Text>
        Loading
        </Text>
      </View>
    )
  }
  return (
   <NavigationContainer>
    <React.Suspense
    fallback= {
      <View style={{flex: 1, justifyContent: "center", alignItems : "center"}}>
      <ActivityIndicator size={"large"} />
      <Text>
      Loading
      </Text>
    </View>
    }
    >
    <SQLiteProvider 
    databaseName="mySQLiteDB.db"
      useSuspense
    > 
    <Stack.Navigator>
      <Stack.Screen name = "Home" component={Home} 
        options={{
          headerTitle : "Expensy",
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
      
    </SQLiteProvider>
   </React.Suspense>
   </NavigationContainer>
  );
}

