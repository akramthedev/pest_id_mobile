import React, {useState, useEffect} from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {formatDate} from './fct';
import { formatLocation } from '../Helpers/locationTransf';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_API } from '../Screens/endpoint';
import { AlertError, AlertSuccess } from "./AlertMessage";

// hello World

export const CardFarm = ({ item }) => {


  const navigation = useNavigation();
  const [role, setRole] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");

  
  useEffect(()=>{
    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      setRole(rolex);
      console.log(item)
     }
    x();   
  },[ ]);


  return(
    <>
    {
      item && 
      <TouchableOpacity key={item.id} style={styles.card} onPress={ 
        ()=>{
          navigation.navigate('SingleFarmPage', { id: item.id });   
        }
      } >  
        <View style={styles.row}>
          <Image source={{ uri: "https://github.com/akramthedev/PFE_APP/blob/main/Design%20sans%20titre%20(1).png?raw=true" }}   style={styles.profileImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>Mesure : {item.size !== null && item.size !== "" ? <>{item.size}&nbsp;m²</>  : "---"}</Text>
            <Text style={styles.details}>Endroit : {item.location ===  null || item.location === "" ? "---" : item.location}</Text>
            <Text style={styles.details}>Date de création : {formatDate(item.created_at)}</Text>
          </View>
          <TouchableOpacity onPress={ 
            ()=>{
              navigation.navigate('SingleFarmPage', { id: item.id });
            }
          }  style={styles.iconContainer}>
            <Ionicons name="settings-outline" style={styles.icon} size={24} color="#5B5B5B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    }
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginLeft : 23,
    marginRight : 23,
    marginBottom: 20,
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, 
    elevation: 2,
    borderColor: "#F1F1F1",
    borderStyle : "solid",
    borderWidth : 1,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.16, 
    shadowRadius: 4, 
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
  },
  profileImage: {
    width: 73,
    height: 100,
    borderRadius:7,
    marginRight: 23,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: 'gray',
    marginBottom: 2,
  },
  iconContainer: {},
});

export default CardFarm;
