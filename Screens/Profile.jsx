 import * as ImagePicker from 'expo-image-picker';
import { saveToken, getToken, deleteToken } from '../Helpers/tokenStorage';
import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { useFocusEffect } from '@react-navigation/native';
import { Image,TextInput, ScrollView,Alert, StyleSheet, TouchableOpacity,RefreshControl , Text, View, PanResponder, Animated, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProfileSkeleton from '../Components/ProfileSkeleton';
import { useAuth } from '../Helpers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { formatDate } from '../Components/fct';
import { ENDPOINT_API } from './endpoint'; 
import { AlertError, AlertSuccess } from "../Components/AlertMessage";
const { width: screenWidth, height : screenHeight  } = Dimensions.get('window');
import LoaderSVG from '../images/Loader.gif'
import rateLimit from 'axios-rate-limit';
import { Svg, Path } from 'react-native-svg';
const axiosInstance = rateLimit(axios.create(), {
  maxRequests: 8,  
  perMilliseconds: 1000, 
});


const Profile = () => {
  const [isSupprimerClicked,setIsSupprimerClicked] = useState(false);
  const [isSupprimerClicked2,setIsSupprimerClicked2] = useState(false);
  const [loaderDelete, setloaderDelete] = useState(false);
  const [dataAdministrateur, setDataAdministrateur] = useState(null)
  const [dataAdministrateurOfChangement, setdataAdministrateurOfChangement] = useState(null)
  const [showError, setShowError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messageError,setmessageError] = useState("");
  const [messageSuccess,setmessageSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [TriggerTheFucker, setTriggerTheFucker] = useState(false);
  const [loader1, setLoader1]=useState(false)
  const [loader2, setLoader2]=useState(false)
  const [image, setImage] = useState(null);  
  const [URi, setURi] = useState(null);  
  const [imageName, setImageName] = useState('');
  const route = useRoute();
  const { id } = route.params; 
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModify, setisModify] = useState(false);
  const [isCurrent, setisCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataProfile, setdataProfile] = useState(null);
  const [dataOfVisitor, setdataOfVisitor] = useState(null);
  const [dataProfileOfChangement, setdataProfileOfChangement] = useState(null);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();
  const { settriggerIt, triggerIt } = useAuth();
  const [role, setRole] = useState(null);
  const [canHeAccess, setCanHeAccess] = useState(null);
  const [changePasswordClicked, setchangePasswordClicked] = useState(null);
  const [ancienMotDepasse, setancienMotDepasse] = useState("");
  const [nouveauMotDePasse, setnouveauMotDePasse] = useState("");
  const [confirmNvmotedepasse, setconfirmNvmotedepasse] = useState("");
  const [loadingPassword, setloadingPassword] = useState(false);
  const [IDCurrent, setIDCurrent] = useState(null);
  const [IDCurrent2, setIDCurrent2] = useState(null);
  const [isNoticeSeen, setIsNoticeSeen] = useState(false);
  const [loaderDelete2, setloaderDelete2] = useState(false);


  useFocusEffect(
    useCallback(() => {

    const x = async ()=>{
      const rolex = JSON.parse(await AsyncStorage.getItem('type'));
      if(rolex !== null && rolex !== undefined ){
        setRole(rolex);
        const userId = await AsyncStorage.getItem('userId');
        const userIdNum = parseInt(userId);
        setIDCurrent2(userIdNum);
        if(id!== null && id !== undefined){
          if(id === 666 || id === "666" || userIdNum === id){
            setisCurrent(true);
            setIDCurrent(userIdNum);
          }
          else{
            setisCurrent(false);
            setIDCurrent(id);
          }
        }
      }
      else{
        console.log('Rolex Undefined... WTF');
      }
     }
    x(); 
  
  }, [navigation, id])
);


 
 
    const fetchProfileData = async ()=>{
      setLoading(true);
      if(id!== null && id !== undefined){
         try{
          const token = await getToken(); 
          const userId = await AsyncStorage.getItem('userId');          
          const userIdNum = parseInt(userId);

          if(id === 666 || id === "666" || userIdNum === id){
            //fetch my infos
            const response = await axiosInstance.get(`${ENDPOINT_API}user/${userIdNum}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){
              setdataProfile(response.data);
              setdataProfileOfChangement(response.data);

              if(response.data.image === null || response.data.image === ""){
                setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
              }
              else{
                setImage(response.data.image);
              }
              if(response.data.type === "admin" || response.data.type === "superadmin"){
                const responseZ = await axiosInstance.get(`${ENDPOINT_API}getadmin/${userIdNum}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if(responseZ.status === 200){
                  setDataAdministrateur(responseZ.data);
                  setdataAdministrateurOfChangement(responseZ.data);
                }
                else{
                  setDataAdministrateur({
                    company_name : "", 
                    company_mobile : "", 
                    company_email : ""
                  });
                  setdataAdministrateurOfChangement({
                    company_name : "", 
                    company_mobile : "", 
                    company_email : ""
                  });
                }
              }
            }
            else{
              setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
            }

           

          }
          else{
            //fetch other infos
            setdataProfile(null);
            setdataProfileOfChangement(null)
            const response = await axiosInstance.get(`${ENDPOINT_API}user/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if(response.status === 200){

              const responseVisitor = await axiosInstance.get(`${ENDPOINT_API}user/${userIdNum}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if(responseVisitor.status === 200){
                setdataOfVisitor(responseVisitor.data);
              }
              if(response.data.canAccess ===  0 || response.data.canAccess === "0"){
                setCanHeAccess(false);
              }
              else{
                setCanHeAccess(true);
              }
              setdataProfile(response.data);
              setdataProfileOfChangement(response.data);
              if(response.data.image === null || response.data.image === ""){
                setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
              }
              else{
                setImage(response.data.image)
              }

              if(response.data.type === "admin" || response.data.type === "superadmin"){
                const responseZ = await axiosInstance.get(`${ENDPOINT_API}getadmin/${response.data.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if(responseZ.status === 200){
                  setDataAdministrateur(responseZ.data);
                  setdataAdministrateurOfChangement(responseZ.data)
                }
                else{
                  setDataAdministrateur({
                    company_name : "", 
                    company_mobile : "", 
                    company_email : ""
                  });
                  setdataAdministrateurOfChangement({
                    company_name : "", 
                    company_mobile : "", 
                    company_email : ""
                  })
                }
              }


            }
            else{
              setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
            }
          }
        } 
        catch(e){
          console.log(e.message);
          if(e.message === "Request failed with status code 404"){
            setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
            setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);           
          }
          else{
            setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
            setShowError(true);
                setTimeout(() => {
                  setShowError(false);
                }, 3000);
                setTimeout(() => {
                  setmessageError("");
                }, 4000);
          }
        } finally{
          setLoading(false);
        }
      }
    }


    useFocusEffect(
      useCallback(() => {
        fetchProfileData();
        return () => setLoading(false);  
      
      }, [id, TriggerTheFucker])
    );


  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsMenuVisible(false);
      });
    } else {
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

   const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          Animated.timing(slideAnim, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setIsMenuVisible(false);
          });
        }
      },
    })
  ).current;

  const getFileNameFromUri = (uri) => {
    return uri.split('/').pop();  
  };



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
  
      setURi(imageUri);
      setImageName(getFileNameFromUri(imageUri)); 
       
    }
  };



  const handleSaveData = async()=>{

     
    if(dataProfileOfChangement.email.length < 5){
      setmessageError("Le champ d'addresse email est invalide!");
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
            setTimeout(() => {
              setmessageError("");
            }, 4000);
    }
    else if(dataProfileOfChangement.fullName.length <= 1){
      setmessageError("Le champ du nom et prénom est invalide.");
            setShowError(true);
            setTimeout(() => {
              setShowError(false);
            }, 3000);
            setTimeout(() => {
              setmessageError("");
            }, 4000);
    }
    else{
          setLoader1(true);
          const userId = await AsyncStorage.getItem('userId');
          const token = await getToken(); 
          let userIdNum;
          
          if(id  === 666 || id === "666"){
            userIdNum =  parseInt(userId);
          }
          else{
            userIdNum = id;
          }
           
      try{
        let data = {
          fullName : dataProfileOfChangement.fullName, 
          email : dataProfileOfChangement.email, 
          mobile : dataProfileOfChangement.mobile, 
          image : image ? image : "https://cdn-icons-png.flaticon.com/256/149/149071.png", 
          type : dataProfileOfChangement.type
        }
        
        const resp = await axiosInstance.post(`${ENDPOINT_API}updateUserInfos/${userIdNum}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){

          let actionY = null;

          if(isCurrent){
            actionY = "Vos informations ont été modifié avec succès.";
          }
          else{
            actionY = "Vos informations ont été modifié avec succès par un administrateur.";            
          }

          let dataX77997 = {
            action : actionY, 
            isDanger : false,
            email : dataProfileOfChangement.email
          }
 

          if(dataProfile.type !== "staff"){
            let data2 = {
              company_name : dataAdministrateurOfChangement.company_name,
              company_mobile : dataAdministrateurOfChangement.company_mobile,
              company_email : dataAdministrateurOfChangement.company_email,
            }
            const resp22 = await axiosInstance.patch(`${ENDPOINT_API}admin/${userIdNum}`, data2, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp22.status === 200){
              setdataAdministrateurOfChangement({...dataAdministrateurOfChangement, company_name :data2.company_name, company_mobile : data2.company_mobile, company_email : data2.company_email });
              setDataAdministrateur({...dataAdministrateur, company_name :data2.company_name, company_mobile : data2.company_mobile, company_email : data2.company_email  })
            }
          }
 
 
          setdataProfile({ ...dataProfile, email: data.email, fullName : data.fullName, mobile : data.mobile, image : data.image, type : data.type })
          setdataProfileOfChangement({ ...dataProfileOfChangement, email: data.email, fullName : data.fullName, mobile : data.mobile, image : data.image, type : data.type })
        
           
          
          setisModify(false);
          setmessageSuccess("Succès : Vos informations ont été mis à jour.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);
        }
        else{

 
          setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
        }
      }
      catch(e){
        console.log(e.message);
 
        setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
      } finally{
        setLoader1(false);
      }
    }
   }


  const restreindreCompte = async()=>{
    if(id!== null && id !== undefined && dataProfile!== null){
      try{
        setLoader2(true);
        const token = await getToken(); 

          let access;

          if(dataProfile.canAccess === 1){
            access = "canAccess"; 
          }
          else{
            access = "canNotAccess";
          }

          const resp = await axiosInstance.get(`${ENDPOINT_API}updateUserRestriction/${id}/${access}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){

             
            if(dataProfile.canAccess === 1){
              setdataProfile({ ...dataProfile, canAccess: 0 });
            }
            else{
              setdataProfile({ ...dataProfile, canAccess: 1 })
            }
             
           
            setmessageSuccess("Succès : le statut du client a été mis à jour.");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 4000);

          }
          else{



            setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
            setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }

      }
      catch(e){

        setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
        setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        console.log(e.message);
      } finally{
        setLoader2(false);
      }
    }
  }

  
 
  const handleClick = (number)=>{
    if(isModify){
      if(dataProfile){
        //annuler la modification du profil si elle est debuté 
        if(dataProfile.image === null || dataProfile.image === ""){
          setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
        }
        else{
          setImage(dataProfile.image);
        }
        setURi(null);setImageName('');setdataProfileOfChangement(dataProfile);setisModify(!isModify);
      }
    }
    if (number === 2){
      //change password
      setchangePasswordClicked(true);
    }
    else if (number === 3){
      //reglages payement
      Alert.alert('Supprimer L histirque des calculs...');
    }
  }



  



  const super_admin_wanna_change_password = async()=>{
    if(nouveauMotDePasse.length <5 || confirmNvmotedepasse.length < 5){
      setmessageError("Votre mot de passe est trop court et n'offre pas une sécurité suffisante.");
      setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else if((nouveauMotDePasse !== confirmNvmotedepasse) && (nouveauMotDePasse.length !== confirmNvmotedepasse.length)){
      setmessageError("le mot de passe et la confirmation ne sont pas identiques.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else{

      try{
        setloadingPassword(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await getToken(); 
        const userIdNum = parseInt(userId);
        let dataPss = {
          nouveau : nouveauMotDePasse, 
          confirmnouveau : confirmNvmotedepasse
        }
        let userIdX;
        if(id === 666 || id === "666"){
          userIdX = userIdNum;
        }
        else{
          userIdX = id;
        }
        const resp = await axiosInstance.post(`${ENDPOINT_API}updatePasswordByAdmin/${userIdX}`,dataPss, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setnouveauMotDePasse("");
          setconfirmNvmotedepasse('');
          setchangePasswordClicked(false);

          if(dataProfile){
            if(id === 666 || id === "666"){
            }
            else{
            }
          }


          setmessageSuccess("Le mot de passe a été modifié avec succès.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);
        }
        else if (resp.status === 287){
          setmessageError("L'ancien mot de passe est invalide.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
        else if (resp.status === 301){

          setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
          setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
              console.log(e.message)

        }
        else if(resp.status === 399){

          setmessageError("Votre mot de passe est trop court et n'offre pas une sécurité suffisante.");
          setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
      }
      catch(e){
        console.log(e.message);
        

        setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setTimeout(() => {
          setmessageError("");
        }, 4000);
      } finally{
        setloadingPassword(false);
      }
    }

    
  }




  const client_wanna_change_his_password = async()=>{
    if(ancienMotDepasse.length<5 || nouveauMotDePasse.length <5 || confirmNvmotedepasse.length < 5){
      setmessageError("Votre mot de passe est trop court et n'offre pas une sécurité suffisante.");
      setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else if((nouveauMotDePasse !== confirmNvmotedepasse) && (nouveauMotDePasse.length !== confirmNvmotedepasse.length)){
      setmessageError("le mot de passe et la confirmation ne sont pas identiques.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
    }
    else{
      try{
        setloadingPassword(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await getToken(); 
        const userIdNum = parseInt(userId);
        let dataPss = {
          ancien : ancienMotDepasse, 
          nouveau : nouveauMotDePasse, 
          confirmnouveau : confirmNvmotedepasse
        }
        let userIdX;
        if(id === 666 || id === "666"){
          userIdX = userIdNum;
        }
        else{
          userIdX = id;
        }
        const resp = await axiosInstance.post(`${ENDPOINT_API}updatePassword/${userIdX}`,dataPss, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if(resp.status === 200){
          setancienMotDepasse('');
          setnouveauMotDePasse("");
          setconfirmNvmotedepasse('');
          setchangePasswordClicked(false);

       

          setmessageSuccess("Votre mot de passe a été modifié avec succès.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);
        }
        else if (resp.status === 287){
           setmessageError("L'ancien mot de passe est invalide.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
        else if (resp.status === 301){
 
          setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
          setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
              console.log(e.message)

        }
        else if(resp.status === 399){
 
          setmessageError("Votre mot de passe est trop court et n'offre pas une sécurité suffisante.");
          setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        }
      }
      catch(e){
        console.log(e.message);
        
 
        setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        setTimeout(() => {
          setmessageError("");
        }, 4000);
      } finally{
        setloadingPassword(false);
      }
    }
  }

 



  const handleLickDelete = async ()=>{

    let staffsUsers = [];

    if(id !== null && id !== undefined){
      if(dataProfile.type === "admin"){
        try{
          setloaderDelete(true);
          const token = await getToken();

          const resp0 = await axiosInstance.get(`${ENDPOINT_API}getAdminIdFromUserId/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if(resp0.status === 200){
            const idAdmin = resp0.data.id;
            const resp00 = await axiosInstance.get(`${ENDPOINT_API}staffs/${idAdmin}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }); 

            if(resp00.status === 200){
              staffsUsers = resp00.data;
               
            }
          }

          const resp = await axiosInstance.delete(`${ENDPOINT_API}deleteUserWhoIsAdmin/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){


 
            if (staffsUsers.length !== 0) {
              for (const staff of staffsUsers) {
                try {
                  await axiosInstance.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${staff.user_id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                } catch (error) {
                  setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
                  setShowError(true);
                    setTimeout(() => {
                      setShowError(false);
                    }, 3000);
                    setTimeout(() => {
                      setmessageError("");
                    }, 4000);                  console.error('Error deleting user:', error);
                }
              }
            }
            
            setIsSupprimerClicked(false);
            setmessageSuccess("Succès : utilisateur supprimé.");
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
            setTimeout(() => {
              setmessageSuccess("");
            }, 4000);
            navigation.goBack();
          }
          else{
            setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
            setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }
        }
        catch(e){


          
          setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          console.log(e.message);
        } finally{
          setloaderDelete(false);
        }
      }
      else if(dataProfile.type === "staff"){
        try{
          setloaderDelete(true);
          const token = await getToken();
          const resp = await axiosInstance.delete(`${ENDPOINT_API}deleteUserStaffNotAdmin/${parseInt(id)}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(resp.status === 200){

            //
 
            setIsSupprimerClicked(false);
              navigation.goBack();
            }
          else{
            setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          }
        }
        catch(e){
 
          setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
          setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
          console.log(e.message);
        } finally{
          setloaderDelete(false);
        }
      }
    }
  }




  
  

  useFocusEffect(
    useCallback(() => {
      const x = async ()=>{
        try{
          const userId = await AsyncStorage.getItem('userId');
          const userIdNum = parseInt(userId);
          setIDCurrent(userIdNum);
          const token = await getToken(); 
          const response = await axios.get(`${ENDPOINT_API}user/${userIdNum}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if(response.status === 200){
            if(parseInt(response.data.profile_notice) === 0 ){
              setIsNoticeSeen(true);
            }
            else{
              setIsNoticeSeen(false);
            }
          }
        }
        catch(e){
          console.log(e.message);
        }
      }
      x(); 
  }, []));




  const handleClickFreshStart = async()=>{
    try{
      const userId = await AsyncStorage.getItem('userId');
      const userIdNum = parseInt(userId);
       
      const token = await getToken(); 
      const response = await axios.get(`${ENDPOINT_API}notice7/${userIdNum}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response.data);

      if (response.data.user) {
        console.log(response.data.user);
      }
       
    }
    catch(e){
      console.log(e.message);
      Alert.alert(JSON.stringify(e.message));
    }
  }


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };




  const handleLickDeleteAllPredictionsOfASingleUser = async()=>{
    
    
    if(id !== null && id !== undefined){

      let idCurrent = null;

      if(id === 666 || id === "666"){
        const userId = await AsyncStorage.getItem('userId');
        idCurrent = parseInt(userId);      
      }
      else{
        idCurrent = parseInt(id);
      }


       try{
        setloaderDelete2(true);
        const token = await getToken();

        const resp0 = await axiosInstance.delete(`${ENDPOINT_API}deleteAllPredictionPerUser/${idCurrent}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if(resp0.status === 200){


          if(id === 666 || id === "666"){
           }
          else{
            
           }
          
          setmessageSuccess("Succès : l'historique de calcul a été bien supprimé.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
          setTimeout(() => {
            setmessageSuccess("");
          }, 4000);


        }
        else{
           setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3000);
          setTimeout(() => {
            setmessageError("");
          }, 4000);
        }

  
        
      }
      catch(e){
 
        setmessageError("Une erreur est survenue. Veuillez nous contacter à 'contact@pcs-agri.com' si le problème persiste.");
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
              }, 3000);
              setTimeout(() => {
                setmessageError("");
              }, 4000);
        console.log(e.message);
      } finally{
        setloaderDelete2(false);
        setIsSupprimerClicked2(false);
      }
      
    }

    
  }

  



  return (
    <>
     
     <AlertError message={messageError} visible={showError} />
     <AlertSuccess message={messageSuccess} visible={showSuccess} />
     


     {
      changePasswordClicked  &&
        <View  style={[styles.popUpSecond, { height: screenHeight - 47  }]} >

              <Text style={styles.titlePP}>
                Modification du mot de passe
              </Text>

              <View style={styles.inputRowPP}>
                {
                  (dataProfile !== null && isCurrent !== null) && 
                  <>
                  {
                    isCurrent ?
                    <>
                    {
                      dataProfile.type !== "superadmin" &&
                      <View
                          style={{
                            flexDirection : "column",
                            marginBottom : 16
                          }}
                        >
                          <Text
                            style={{
                              fontSize : 16, 
                              fontWeight : "500",
                              paddingLeft : 4
                            }}
                          >
                            Ancien mot de passe:
                          </Text>
                          <TextInput
                            value={ancienMotDepasse}
                            onChangeText={(text) => setancienMotDepasse(text)}
                            style={styles.inputPP}
                            placeholder="Ancien mot de passe"
                            
                          />
                        </View>
                    }
                    </>
                    :
                    <>
                      {
                        dataOfVisitor.type !== "superadmin" &&
                        <View
                          style={{
                            flexDirection : "column",
                            marginBottom : 16
                          }}
                        >
                          <Text
                            style={{
                              fontSize : 16, 
                              fontWeight : "500",
                              paddingLeft : 4
                            }}
                          >
                            Ancien mot de passe:
                          </Text>
                          <TextInput
                            value={ancienMotDepasse}
                            onChangeText={(text) => setancienMotDepasse(text)}
                            style={styles.inputPP}
                            placeholder="Ancien mot de passe"
                            
                          />
                        </View>
                      }
                    </>
                  }
                  </>                  
                }

                <View
                  style={{
                    flexDirection : "column",
                    marginBottom : 16
                  }}
                >
                  <Text
                    style={{
                      fontSize : 16, 
                      fontWeight : "500",
                      paddingLeft : 4
                    }}
                  >
                    Nouveau mot de passe:
                  </Text>
                  <TextInput
                    style={styles.inputPP}
                    placeholder="Nouveau mot de passe"
                    value={nouveauMotDePasse}
                    onChangeText={(text) => setnouveauMotDePasse(text)}
                  />
                </View>
                <View
                  style={{
                    flexDirection : "column",
                    marginBottom : 16
                  }}
                >
                  <Text
                    style={{
                      fontSize : 16, 
                      fontWeight : "500",
                      paddingLeft : 4
                    }}
                  >
                    Confirmer le mot de passe:
                  </Text>
                  <TextInput
                    style={styles.inputPP}
                    placeholder="Confirmer mot de passe"
                    value={confirmNvmotedepasse}
                    onChangeText={(text) => setconfirmNvmotedepasse(text)}
                  />
                </View>
              </View>

              <View style={styles.buttonRowPP}>
                <TouchableOpacity disabled={loadingPassword} onPress={()=>{setchangePasswordClicked(false);setnouveauMotDePasse('');setancienMotDepasse('');setconfirmNvmotedepasse('');}}  style={styles.buttonPPA}>
                  <Text style={styles.buttonTextPPA}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={loadingPassword}  
                  style={[
                    styles.buttonPPC,
                    { opacity: loadingPassword ? 0.3 : 1 }
                  ]} 
                  onPress={()=>{
                    if(isCurrent !== null && dataProfile !== null){
                      if(isCurrent){
                        if(dataProfile.type === "superadmin"){
                          super_admin_wanna_change_password();
                        }
                        else{
                          client_wanna_change_his_password();
                        }
                      }
                      else{
                        if(dataOfVisitor.type === "superadmin"){
                          super_admin_wanna_change_password();
                        }
                        else{
                          return null;
                        }
                      }
                    }
                  }} 
                >
                  <Text style={styles.buttonTextPPC}>Confirmer</Text>
                </TouchableOpacity>
              </View>
             
        </View>
    }



     {(isNoticeSeen && isCurrent !== null && dataProfile!== null) && 
      <View style={{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex : 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <View style={{
          backgroundColor: 'white', 
          padding: 20, 
          borderRadius: 10, 
          width: '90%', 
          shadowColor: '#000', 
          shadowOpacity: 0.2, 
          shadowRadius: 10,
          elevation: 5 
        }}>

          <TouchableOpacity style={{
              backgroundColor: 'black', 
              height: 35,
              width: 35,
              alignItems: "center", 
              justifyContent: "center",  
              position: "absolute",
              top: 9,
              right: 9,              
              borderRadius: 100, 
              zIndex: 9999,
            }}
            disabled={false}
            onPress={()=> {
              setIsNoticeSeen(false);
              handleClickFreshStart();
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={{ 
              fontSize: 23, 
              fontWeight: 'bold', 
              marginBottom: 25 , 
              marginTop : 10,
              alignItems  :"flex-end", 
            }}>

            
              

              <Svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="none" viewBox="0 0 57 57">
                <Path   
                  fill="#FFC017" 
                  d="m39.637 40.831-5.771 15.871a1.99 1.99 0 0 1-3.732 0l-5.771-15.87a2.02 2.02 0 0 0-1.194-1.195L7.298 33.866a1.99 1.99 0 0 1 0-3.732l15.87-5.771a2.02 2.02 0 0 0 1.195-1.194l5.771-15.871a1.99 1.99 0 0 1 3.732 0l5.771 15.87a2.02 2.02 0 0 0 1.194 1.195l15.871 5.771a1.99 1.99 0 0 1 0 3.732l-15.87 5.771a2.02 2.02 0 0 0-1.195 1.194"
                />
              </Svg>
              &nbsp;&nbsp;
              Profil Utilisateur
            </Text>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '400', 
            marginBottom: 21 
          }}>
            Ici, vous pouvez consulter et modifier les informations de votre profil. Assurez-vous de garder vos informations à jour afin de bénéficier d'une meilleure expérience.
          </Text>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '400', 
            marginBottom: 21 
          }}>
            • <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 21 
          }}>Mettre à jour vos informations personnelles </Text>: modifiez votre nom, adresse e-mail et autres informations pour garder votre profil à jour.
          </Text>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '400', 
            marginBottom: 21 
          }}>
            • <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 21 
          }}>Voir les profils de vos personnels </Text>: accédez aux informations des membres de votre équipe. En tant que super administrateur, vous pouvez également modifier ou supprimer les informations des autres utilisateurs pour maintenir la gestion de votre équipe à jour.
          </Text>
          {
            (dataProfile!== null  && isCurrent!== null) && (

              isCurrent === true && dataProfile.type !== "staff" &&
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '400', 
                marginBottom: 21 
              }}>
                • <Text style={{ 
                fontSize: 18, 
                fontWeight: '700', 
                marginBottom: 21 
              }}>Voir les profils de vos personnels </Text>: accédez aux informations de vos clients, en tant que super administrateur, vous pouvez également les modifier.
              </Text>
            ) 
          }
        </View>
      </View>
    }
    {
        isSupprimerClicked && 
        <View style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex : 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre transparent
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white', // Pop-up en blanc
            padding: 20, 
            borderRadius: 10, 
            width: '90%', 
            shadowColor: '#000', 
            shadowOpacity: 0.2, 
            shadowRadius: 10,
            elevation: 5 // Ombre pour Android
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 5 
            }}>

              Si vous supprimez ce membre du personnel,
            
            </Text>
            <Text style={{ 
              fontSize: 17, 
              fontWeight: '400', 
              marginBottom: 25 
            }}>

              toutes les données associées, notamment ses données, seront également supprimées.

            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>

              <TouchableOpacity style={{
                backgroundColor: '#eee', 
                paddingVertical: 13,
                width : "30%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center"
                }}
                onPress={()=>{setIsSupprimerClicked(false)}}
                disabled={loaderDelete}
                >
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                Annuler
                </Text>
              </TouchableOpacity>


              <TouchableOpacity style={{
                backgroundColor: '#AF0000', 
                paddingVertical: 13,
                width : "67%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={loaderDelete}
                onPress={()=>{
                  handleLickDelete();
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {
                  loaderDelete ? 
                  "suppression en cours..."
                  :
                  "Supprimer définitivement"
                }
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      }




{
        isSupprimerClicked2 && 
        <View style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex : 10000,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre transparent
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white', // Pop-up en blanc
            padding: 20, 
            borderRadius: 10, 
            width: '90%', 
            shadowColor: '#000', 
            shadowOpacity: 0.2, 
            shadowRadius: 10,
            elevation: 5 // Ombre pour Android
          }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 5 
            }}>

              Êtes-vous sûr de vouloir supprimer l'historique de tous vos calculs ? 
            
            </Text>
            <Text style={{ 
              fontSize: 17, 
              fontWeight: '400', 
              marginBottom: 25 
            }}>

              toutes vos données associées seront supprimées.

            </Text>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between' 
            }}>

              <TouchableOpacity style={{
                backgroundColor: '#eee', 
                paddingVertical: 13,
                width : "30%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center"
                }}
                onPress={()=>{setIsSupprimerClicked2(false)}}
                disabled={loaderDelete2}
                >
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                Annuler
                </Text>
              </TouchableOpacity>


              <TouchableOpacity style={{
                backgroundColor: '#AF0000', 
                paddingVertical: 13,
                width : "67%",
                borderRadius: 5,
                alignItems : "center", 
                justifyContent : "center",                
                borderRadius: 5
              }}
                disabled={loaderDelete2}
                onPress={()=>{
                  handleLickDeleteAllPredictionsOfASingleUser();
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {
                  loaderDelete2 ? 
                  "suppression en cours..."
                  :
                  "Supprimer définitivement"
                }
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      }



    



    <View style={styles.container}>
      
     <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
     >
      {loading === false && (
        <>
          <View style={styles.titleContainer}>
          {
            loading && 
            <View style={{ position: "absolute", left :23 ,zIndex: 10,}} > 
              <Image
                source={LoaderSVG}  
                style={styles.imageJOZNJORSFDOJFSWNVDO} 
              />
            </View>
          }

            <Text style={styles.titleText}>
              {isCurrent !== null && <>{isCurrent ? "Mon " : ""}</>} Profil
            </Text>
            <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
              <Ionicons name="menu" size={24} color="#3E6715" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileContainer}>
            
             

            {
              isModify ? 
                <>
                {
                  image && 
                  <Image
                    style={styles.profileImage}
                    source={{ uri: image }} 
                  />
                }
                </>
                :
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: dataProfile && dataProfile.image
                      ? dataProfile.image
                      : "https://github.com/akramthedev/pest_id_frontend/blob/master/images/avatar.png?raw=true"
                  }}
                />
            }
             


            

            
            {
              dataProfile && 
              (
                dataProfile.canAccess === 0 &&
                <Text  style={styles.zisfudowcuosdw} >
                Accès restreint
                </Text>
              )
            }


            {isModify && (
              <TouchableOpacity 
                style={styles.modifyButton} 
                onPress={pickImage}  
              >
                <Text style={styles.modifyButtonText}>Modifier l'image</Text>
              </TouchableOpacity>
            )}
 
            
          </View>
        </>
      )}

      {loading ? (
        <ProfileSkeleton />
      ) : dataProfile && (
        <>
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Nom et prénom :</Text>
            {isModify ? (
              <TextInput
                placeholderTextColor="#ccc"
                placeholder="Champs obligatoire"
                style={styles.input2}
                value={dataProfileOfChangement.fullName}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, fullName: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.fullName === null || dataProfile.fullName === ""  ? "---" : dataProfile.fullName}</Text>
            )}
          </View>
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Adresse email :</Text>
            {isModify ? (
              <TextInput
                style={styles.input2}
                placeholderTextColor="#ccc"
                placeholder="Champs obligatoire"
                value={dataProfileOfChangement.email}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, email: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.email}</Text>
            )}
          </View>
         
          <View style={styles.rowXXX}>
            <Text style={styles.label}>Téléphone :</Text>
            {isModify ? (
              <TextInput
                style={styles.input2}
                placeholderTextColor="#ccc"
                placeholder="Champs non obligatoire"
                value={dataProfileOfChangement.mobile}
                onChangeText={(text) => setdataProfileOfChangement({ ...dataProfileOfChangement, mobile: text })}
              />
            ) : (
              <Text style={styles.value}>{dataProfile.mobile ? dataProfile.mobile : '---'}</Text>
            )}
          </View>

         
         
          
         

          <>
          {
            ((!isCurrent && dataOfVisitor!== null) && isModify) &&
            <>
          {
            dataProfileOfChangement &&  
            <View style={styles.rowXXX}>
            <Text style={styles.label}>Role : </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={dataProfileOfChangement.type}
                style={styles.picker}
                onValueChange={(itemValue) => setdataProfileOfChangement({ ...dataProfileOfChangement, type: itemValue })}
              >
                <Picker.Item label="Administrateur" value="admin" />
                <Picker.Item label="Staff" value="staff" />
              </Picker>
            </View>
          </View>
          }

            </>
          }
          </>
          
           

               
          <>
          {
            !isModify && 
            <>
              {
            (dataProfile.type !== null && dataProfile.type !== undefined )&&  
            <View style={styles.rowXXX}>
              <Text style={styles.label}>Role : </Text>
              <Text style={styles.value}>
                {dataProfile && (
                  <>  
                    {dataProfile.type.toLowerCase() === "admin"
                      ? "Administrateur"
                      : dataProfile.type.toLowerCase() === "superadmin"
                        ? "Super-Administrateur"
                        : "Personnel"}
                  </>
                )}
              </Text>
            </View>
          }
            </>
          }
          </>
          

          <View style={styles.rowXXX}>
            <Text style={styles.label}>Date d'inscription</Text>
            <Text style={styles.value}>{formatDate(dataProfile.created_at)}</Text>
          </View>
              


       
        {
          dataProfile && 
          (
            dataProfile.type !== "staff" && dataAdministrateur && dataAdministrateurOfChangement &&
            <>
            <View style={styles.hr} />
              <View style={styles.rowXXX} >
                      <Text style={styles.label} >Nom Société : </Text>
                      {isModify ? (
                        <TextInput
                          style={styles.input2}
                          placeholderTextColor="#ccc"
                          placeholder="Champs non obligatoire"
                          value={dataAdministrateurOfChangement.company_name}
                          onChangeText={(text) => setdataAdministrateurOfChangement({ ...dataAdministrateurOfChangement, company_name: text })}
                        />
                      ) : (
                        <Text style={styles.value}>
                          {dataAdministrateur && 
                          ( 
                          (dataAdministrateur.company_name  === null || dataAdministrateur.company_name.length <= 1) ? "---" 
                          : dataAdministrateur.company_name 
                          )
                          }
                        </Text>
                      )}
                    </View>



                    <View style={styles.rowXXX} >
                      <Text style={styles.label} >Téléphone Société : </Text>
                      {isModify ? (
                        <TextInput
                          style={styles.input2}
                          placeholderTextColor="#ccc"
                          placeholder="Champs non obligatoire"
                          value={dataAdministrateurOfChangement.company_mobile}
                          onChangeText={(text) => setdataAdministrateurOfChangement({ ...dataAdministrateurOfChangement, company_mobile: text })}
                        />
                      ) : (
                        <Text style={styles.value}>
                          {dataAdministrateur && 
                          ( 
                          (dataAdministrateur.company_mobile  === null || dataAdministrateur.company_mobile.length <= 1) ? "---" 
                          : dataAdministrateur.company_mobile 
                          )
                          }
                        </Text>
                      )}
                    </View>

                    <View style={styles.rowXXX} >
                      <Text style={styles.label} >Email Société : </Text>
                      {isModify ? (
                        <TextInput
                          style={styles.input2}
                          placeholderTextColor="#ccc"
                          placeholder="Champs non obligatoire"
                          value={dataAdministrateurOfChangement.company_email}
                          onChangeText={(text) => setdataAdministrateurOfChangement({ ...dataAdministrateurOfChangement, company_email: text })}
                        />
                      ) : (
                        <Text style={styles.value}>
                          {dataAdministrateur && 
                          ( 
                          (dataAdministrateur.company_email  === null || dataAdministrateur.company_email.length <= 1) ? "---" 
                          : dataAdministrateur.company_email 
                          )
                          }
                        </Text>
                      )}
                    </View>

            </>
          ) 
        }



          

          {isCurrent !== null && (
            <>
              {(isCurrent === true || (role && role === "superadmin")) && (
                <>
                              <View style={styles.hr} />

                  <TouchableOpacity  onPress={()=>{handleClick(2)}} style={styles.modifierVotreX}>
                    <Text style={styles.modifierVotreXText}>Modifier le mot de passe</Text>
                    <Ionicons name="arrow-forward" size={24} color="gray" />
                  </TouchableOpacity>

                 

                  {
                    (IDCurrent !== null && dataProfile.type !== "staff") && 
                    <TouchableOpacity  onPress={()=>{ navigation.navigate('MesPersonels', { id: IDCurrent }) }} style={styles.modifierVotreX}>
                      <Text style={styles.modifierVotreXText}>Voir {isCurrent!== null && (isCurrent === true ? "mes" : "ses")} personnels</Text>
                      <Ionicons name="arrow-forward" size={24} color="gray" />
                    </TouchableOpacity>
                  }


                  <TouchableOpacity  onPress={()=>{setIsSupprimerClicked(false);setURi(null);setImageName('');setdataProfileOfChangement(dataProfile);setisModify(false);setIsSupprimerClicked2(true);}} style={styles.modifierVotreX}>
                    <Text style={styles.modifierVotreXText}>Supprimer l'historique des calculs</Text>
                    <Ionicons name="arrow-forward" size={24} color="gray" />
                  </TouchableOpacity>


                </>
              )}
            </>
          )}

          
        </>
      )}
    </ScrollView>






        <View style={styles.buttonContainer}>
          {role && isCurrent !== null && (
            <>
              {role === "superadmin" || isCurrent === true ? (
                <>
                  {!isModify ? (
                    <>

                      {
                        isCurrent ? 
                        <>
                          <TouchableOpacity
                            disabled={loading || !dataProfile || loader1 }
                            style={[
                              styles.saveButton, 
                              { opacity: loading || !dataProfile || loader1  ? 0.3 : 1 } 
                            ]} 
                            onPress={() => { setisModify(!isModify); }}
                          >
                            <Text style={styles.buttonTextWhite}>Modifier le profil</Text>
                          </TouchableOpacity>
                        </>
                        :
                        <>
                         

                          <TouchableOpacity
                            onPress={()=>{
                              setIsSupprimerClicked(true);
                            }}
                            disabled={loading || loader2 || loader1 || !dataProfile}
                            style={[
                              
                              styles.supprimerLepersonel2, 
                              { opacity: loading ? 0.3 : 1 } 
                            ]}
                          >
                            <Text style={styles.buttonTextWhite}>Supprimer</Text>
                          </TouchableOpacity>



 
                          {
                            dataProfile!== null && 
                            (
                              <TouchableOpacity
                                disabled={loading || !dataProfile || loader2}
                                style={[
                                   styles.canHeAccessNot,
                                  { opacity: loading || !dataProfile || loader2 || loader1 ? 0.3 : 1 }
                                ]}
                                onPress={() => {restreindreCompte()}}
                              >
                                <Text style={styles.buttonTextWhite}>{dataProfile.canAccess === 1 ? "Restreindre" : "Autoriser"}</Text>
                              </TouchableOpacity>
                            )
                          }




                          <TouchableOpacity
                            disabled={loading || !dataProfile || loader1 || loader2}
                            style={[
                              styles.saveButton, 
                              { opacity: loading || !dataProfile || loader1 || loader2 ? 0.3 : 1 } 
                            ]} 
                            onPress={() => { setisModify(!isModify); }}
                          >
                            <Text style={styles.buttonTextWhite}>Modifier</Text>
                          </TouchableOpacity>

                      
                        </>
                      }
                      
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                       disabled={loading || !dataProfile || loader1}
                        style={styles.cancelButton}
                        onPress={() => { 
                          if(dataProfile.image === null || dataProfile.image === ""){
                            setImage("https://cdn-icons-png.flaticon.com/256/149/149071.png");
                          }
                          else{
                            setImage(dataProfile.image);
                          }
                          setURi(null);setImageName('');setdataProfileOfChangement(dataProfile);setisModify(!isModify); }}
                      >  
                        <Text style={styles.buttonTextBlack}>Annuler</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={loading || !dataProfile || loader1}
                        style={[
                          styles.saveButton, 
                          { opacity: loading|| !dataProfile || loader1 ? 0.3 : 1 } 
                        ]}
                        
                        onPress={handleSaveData}
                      >
                        <Text style={styles.buttonTextWhite}>Sauvegarder</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={()=>{
                      setIsSupprimerClicked(true);
                    }}
                    disabled={loading || !dataProfile}
                     style={[
                      styles.supprimerLepersonel, 
                      { opacity: loading ? 0.3 : 1 } 
                    ]}
                  >
                    <Text style={styles.buttonTextWhite}>Supprimer le personnel</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </View>











      
      {isMenuVisible && (
        <Animated.View
          style={[styles.popup, { transform: [{ translateX: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          <ScrollView style={styles.popupContent}>
            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard'); toggleMenu(); }} style={styles.logo}>
               
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { navigation.navigate('Dashboard'); toggleMenu(); }} style={styles.menuItem}>
            <Ionicons name="speedometer-outline" size={24} color="black" />
            <Text style={styles.menuText}>Tableau de bord</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { navigation.navigate('Profile', { id: 666 }); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="person-outline" size={24} color="black" />
              <Text style={styles.menuText}>Mon Profile</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
            </TouchableOpacity>
 

            {
                        (role && (role.toLowerCase() === "superadmin") ) &&
                        <TouchableOpacity onPress={() => { navigation.navigate('Broadcast'); toggleMenu(); }} style={styles.menuItem}>
                            <Ionicons name="megaphone-outline" size={24} color="black" />
                            <Text style={styles.menuText}>Station Broadcast</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
                        </TouchableOpacity>
                        }
            {
              (role && (role.toLowerCase() === "superadmin") )&&
              <>
              <TouchableOpacity onPress={() => { navigation.navigate('MesClients'); toggleMenu(); }} style={styles.menuItem}>
                <Ionicons name="people-outline" size={24} color="black" />
                <Text style={styles.menuText}>Liste des Utilisateurs</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { navigation.navigate('SuperAdminDemande'); toggleMenu(); }} style={styles.menuItem}>
                <Ionicons name="mail-outline" size={24} color="black" />
                <Text style={styles.menuText}>Demandes Clients</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
              </TouchableOpacity>
              
              </>
            }

           
           
            <TouchableOpacity onPress={() => { navigation.navigate('Historique'); toggleMenu(); }} style={styles.menuItem}>
            <Ionicons name="archive-outline" size={24} color="black" />
            <Text style={styles.menuText}>Historique de calcul</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnCalcul'); toggleMenu(); }} style={styles.menuItem}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text style={styles.menuText}>Ajouter un calcul</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
            </TouchableOpacity>
            
            
            {
              ((role !== null && role !== undefined) && (role.toLowerCase() === "superadmin" || role.toLowerCase() === "admin") ) &&
                <>
                  <TouchableOpacity onPress={() => { navigation.navigate('MesFermes'); toggleMenu(); }} style={styles.menuItem}>
                  <Ionicons name="leaf-outline" size={24} color="black" />
                  <Text style={styles.menuText}>Mes fermes</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('AjouterUneFerme'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ajouter une ferme</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
                  </TouchableOpacity>
                 
                 
                 
                  {
                  IDCurrent2 && 
                  <TouchableOpacity onPress={() => { navigation.navigate('MesPersonels',{id : IDCurrent2}); toggleMenu(); }} style={styles.menuItem}>
                  <Ionicons name="people-outline" size={24} color="black" />
                  <Text style={styles.menuText}>Mes personnels</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
                </TouchableOpacity>
                 }

                  
                  <TouchableOpacity onPress={() => { navigation.navigate('AjouterUnPersonel'); toggleMenu(); }} style={styles.menuItem}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ajouter un personnel</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
                  </TouchableOpacity>
                </>
            }
            
            
            <TouchableOpacity 
                onPress={async ()=>{
                  deleteToken();
                  settriggerIt((prev) => !prev);
                  await AsyncStorage.removeItem('userId');
                  await AsyncStorage.removeItem('type');
                  setTimeout(()=>{
                    navigation.navigate('Home');
                  }, 400);
                }
              } 
                style={styles.menuItem}>
              <Ionicons name="log-out-outline" size={24} color="black" />
              <Text style={styles.menuText}>Se déconnecter</Text><Ionicons style={{ position : "absolute",right:23 }}  name="chevron-forward" size={24} color="#565656" />
            </TouchableOpacity>
          </ScrollView>
          {
            /*
            <View style={styles.footer}>
              <Text style={styles.footerText}>PCS AGRI</Text>
              <Text style={styles.footerText}>© all rights reserved • 2024</Text>
            </View>
            */
          }
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              <Ionicons style={styles.iconX} name="close" size={20} color="#325A0A" />
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 23,
  },
  titleContainer: {
    marginTop : 18,

    marginBottom : 23,
    alignItems: 'center',
    position : "relative"
  },

  
  rowXXX: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height : 35,
    marginLeft : 23,
    marginRight : 23 
  },
  hr: {
    borderBottomColor: '#EFEFEF', 
    borderBottomWidth: 1,         
    marginTop : 20,
    marginBottom : 20,
    marginRight : 23, 
    marginLeft : 23
  },
  label: {
    fontWeight: '500',
    fontSize : 16
  },
  value: {
    textAlign: 'right',
    fontSize : 16
  },



  menu: {
    position: "absolute",
    right: 23,
    zIndex: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 19,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderColor : "gainsboro",
    borderRadius: 1000,
  },
  roleText: {
    marginTop: 10,
    fontSize: 14,
    color : "#B8B8B8",
    fontWeight: '500',
  },
  pickerWrapper: {  
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    height : 30,
    width : 190,
    justifyContent : "center"
  },
  picker: {
    borderWidth: 1,
     borderRadius: 10,
    fontSize : 16,
     height: 48, 
  },
  imageJOZNJORSFDOJFSWNVDO : {
    height : 23, width : 23
  },
  
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft : 22,
    borderRadius: 8,
    marginBottom: 16,
    paddingRight: 22,
    marginLeft : 23, 
    marginRight : 23,
    fontSize : 16
  },input2: {
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
     borderRadius: 8,
     fontSize : 16, 
     width : 190,
     paddingLeft : 10,
     paddingRight : 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 20,           
    left: 0,
    right: 0,
    marginRight: 23,
   },
   buttonContainer2: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 75,           
    left: 0,
    right: 0,
    marginRight: 23,
   },
   zisfudowcuosdw : {
    backgroundColor : "#AF0000", 
    padding : 3, 
    paddingLeft : 10, 
    paddingRight : 10,
    marginTop : 6, 
    borderRadius : 30,
    color : "white",
   },
   newImageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  newImage: {
    width: 100,
    height: 100,
    borderRadius: 10, // Optional: Add border radius for rounded corners
  },

  cancelButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#C8C8C8"
  },
  saveButton: {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#487C15',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  supprimerLepersonel2 :{
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#AF0000',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  canHeAccess : {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#AF0000',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  
  canHeAccessNot : {
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#C66C02',
    alignItems: 'center',
    borderRadius: 8,
    flex : 1
  },
  supprimerLepersonel : {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#B40000',
    alignItems: 'center',
    borderRadius: 8,
  },

  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor : 'white', // Button color
    padding: 10,
    paddingLeft : 15,
    paddingRight : 15,
    borderRadius: 40,
    marginTop: 10,
    borderWidth : 1, 
    borderColor : "#487C15",
  },
  modifyButtonText: {
    color: '#487C15', // Text color
    marginLeft: 5,
    fontWeight : "500", 
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTextBlack: {
    color: 'black',
    fontSize: 16,
  },
  buttonTextBlack2 : {
    color: '#457515',
    fontSize: 16,
    fontWeight : "500"
  },
  popUpSecond: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 300,
    backgroundColor: 'white',  
    alignItems: 'center',
    width: '100%', 
    padding : 23
  },



  titlePP: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
  },
  inputRowPP: {
    flexDirection: 'column',
    width: '100%',
    height : 385,
    justifyContent : "flex-end",
  },
  inputPP: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    borderRadius: 8,
    fontSize : 15,
    textAlign : "left",
    paddingLeft : 20,
    paddingRight :20,
    marginTop : 7,
    backgroundColor: '#fff',
  },
  buttonRowPP: {
    flexDirection: "row",
    marginLeft: 23,
    justifyContent : "space-between", 
    position: 'absolute',  
    bottom: 20,           
    left: 0,
    right: 0,
    marginRight: 23,
  },
  buttonPPC: {
    backgroundColor: '#487C15',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    width : "61%"
  },
  buttonPPA: {
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#487C15",
    width : "35%",
  },
  buttonPPQUITER : {
    backgroundColor: 'white',
    paddingVertical: 12,
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    borderWidth : 1, 
    borderColor : "#487C15",
    width : "100%",
  },
  buttonTextPPA: {
    color: '#487C15',
    fontSize: 16,
    fontWeight : "500",
    textAlign: 'center',
  },

  buttonTextPPC: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },




  popupText: {
    color: '#fff',
    fontSize: 20,
  },
  popup: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '105%',
    width: '100%',
    backgroundColor: 'white',  
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 15,
    zIndex: 9999,
  },
   
  imagePreview: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imageName: {
    marginTop: 8,
    fontSize: 16,
    color: 'gray',
  },

  popupContent: {
    padding: 20,
  },
  logo: {
    marginTop : 20,
    marginLeft : "auto",
    marginRight : "auto",
    marginBottom: 20,
    height : 27,
    width : 112,
  },
  imageLogo : {
    height : "100%", 
    width : "100%"
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    height : 55,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 53,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#656565',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 35,
    right: 17,
    backgroundColor: '#dafdd2',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
  modifierVotreX : {
    height: 21,
    marginTop : 6 ,
    width : "auto",
    justifyContent : "space-between",
    marginBottom: 16,
    flexDirection: 'row',      
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginLeft : 23, 
    marginRight : 23
  },
  modifierVotreXText : {
    color: "#6D6D6D",
    fontSize : 16
  },
  scrollViewXX : {
    width : "100%", 
    marginBottom : 60
  }
});

export default Profile;