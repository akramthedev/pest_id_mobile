import React, {useState, useEffect} from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT_API } from '../Screens/endpoint';
import { useRoute } from '@react-navigation/native';
import { AlertError, AlertSuccess } from "./AlertMessage";
import { Svg, Path } from 'react-native-svg';


 


export  const CardAdmin = ({ item,index }) => {
  
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const nav = useNavigation();
  const route = useRoute();

 


  const formatDate = (dateString) => {
    const date = new Date(dateString);  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
    return `${day}/${month}/${year}`; 
  };


  return (
    <TouchableOpacity key={item.id} style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          nav.navigate('Profile', { id: item.id });
        }}
        style={styles.row}
      >
        <Image
          source={{
            uri: item.image
              ? item.image
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          
      
          
          <View style={styles.rowHHHH}>
            <Text style={styles.nameX}>
              {item.fullName + '  '}
            </Text>
          </View>
        
  
          <View style={styles.rowHHHH}>


            {  route.name === "MesClients"  && (
              
              <Text
              style={
                item.type === 'admin'
                  ? styles.detailsKKKK1
                  : item.type === 'superadmin'
                  ? styles.detailsKKKKSP
                  : styles.detailsKKKKStaff
              }
            >
              {item.type === 'admin'
                ? 'Administrateur'
                : item.type === 'staff'
                ? 'Personnel'
                : 'Super-Administrateur'}
            </Text>

            )}
            {item.canAccess === 0 && (
              <Text style={styles.detailsKKKK2}>Accès restreint</Text>
            )}

            
  
            
          </View>
  
          <Text style={styles.details}>{item.email}</Text>
          <Text style={styles.details}>{formatDate(item.created_at)}</Text>
           
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
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
    width: 85,
    height: 85,
    borderRadius: 200,
    marginRight: 16,
  },
  rowHHHH : {
    flexDirection: "row",
    minHeight : 29,
    alignItems : "center",
    zIndex : 10
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    marginBottom: 4,
  },
  nameX : {
    fontWeight: 'bold',
    fontSize: 17,
    marginRight: 0
  } ,
  details: {
    color: 'gray',
    marginBottom: 2,
  },
  detailsKKKK1 : {
    borderRadius : 50, 
    padding : 2.2, 
    paddingLeft : 8, 
    paddingRight : 8,
    backgroundColor : "#9001C2",
    marginRight : 6,
    color : "white"
  },
  detailsKKKKSP : {
    borderRadius : 50, 
    padding : 2.2, 
    paddingLeft : 8, 
    paddingRight : 8,
    backgroundColor : "black",
    marginRight : 6,
    color : "white"
  },
  detailsKKKKStaff : {
    borderRadius : 50, 
    padding : 2.2, 
    paddingLeft : 8, 
    paddingRight : 8,
    backgroundColor : "#1E971E",
    marginRight : 6,
    color : "white"
  },
  detailsKKKK2 : {
    borderRadius : 50, 
    padding : 2.2, 
    paddingLeft : 8, 
    paddingRight : 8,
    backgroundColor : "#A30202",
    color : "white"

  },
  detailsKKKNew : {
    borderRadius : 50, 
    padding :1, 
    paddingLeft : 8, 
    paddingRight : 8,
    backgroundColor : "#E9830F",
    marginRight : 6,
    color : "black",
    fontSize : 14,
    borderRadius : 20,
    borderWidth : 1, 
    borderColor : "#E1E1E1"
  },
  iconContainer: {},
});

export default CardAdmin;
