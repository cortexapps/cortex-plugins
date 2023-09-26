/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import Select from 'react-select';
import { CortexApi, PluginContextLocation } from "@cortexapps/plugin-core";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
  Input,
  Button
  } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";


const Attestation: React.FC = () => {   
    
    const context = usePluginContext();
    const cortexTag = context.entity!.tag;
    const cortexUrl = context.apiBaseUrl;
    const currentUser = context.user.name;
    
    const entityType = context.entity?.type;
   
    const [posts, setPosts] = React.useState<any[]>([]);
    const [hasList, setHasList] = React.useState(false);
    const [isOwner, setIsOwner] = React.useState(false);
    const [isChecked, setIsChecked] = React.useState(false);
    const [itar, setItar] = React.useState("");
    const [ada, setAda] = React.useState("");
    const [pii, setPII] = React.useState("");
   // const [date, setDate] = React.useState();
   // const [selected, setSelected] = React.useState("");
   // const [signedBy, setSignedBy] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(
        context.location === PluginContextLocation.Entity );
    
    
    React.useEffect(() => {
        if (context.location === PluginContextLocation.Entity) {
          // Code to see if there are any previous Attestations.
          const fetchData = async (): Promise<void> => {
            // Let's see if there is any previous checklist data
            try
            {
              console.log("checking for custom data")
              console.log(cortexTag)
              console.log(cortexUrl)
              const gUrl = `${cortexUrl}/catalog/${cortexTag}/custom-data/checklist`
              console.log(gUrl)
                const result = await fetch(
                    gUrl
                  );
                  console.log(result.status)
                  if (result.ok) {
                    const resultJson = await result.json();
                    setPosts(resultJson.value)
                    setHasList(true)
                  }
            }
            catch(error) {
              console.log(error.message)

            }             
            setIsLoading(false);
          };
          // Code to figure out if current user owns the entity
          const getOwnership = async (): Promise<void> => {
            
            try
            {
              console.log("checking for owner")
              const userRole = context.user.role;

              console.log("The current user role is " + userRole)
            if (userRole === "OWNER") {
                
                  setIsOwner(true)
              }
        
              
            }
              
             catch(error) {
                console.log(error.message)

            }
                       
            setIsLoading(false);
        
          };
          void getOwnership();
          void fetchData();
        }
      }, []);
  
       
    const checkHandler = () => {
        setIsChecked(!isChecked)
      }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const adaHandler = (ada) => {
        setAda(ada.value);
        console.log(ada)
    };
    const itarHandler = (itar) => {
        setItar(itar.value);
        console.log(itar)
    };
    const piiHandler = (pii) => {
        setPII(pii.value);
        console.log(pii)
    };
     // const handleSubmit = async (e) => {
        // e.preventDefault();
        
        const postData = async () => {
          console.log(`about to do the posty post for ${cortexTag}`)
          const cdUrl = `${cortexUrl}/catalog/${cortexTag}/custom-data`;
          console.log (cdUrl)
          console.log(itar)
          console.log(ada)
          console.log(pii)
          console.log(currentUser)
          try {
            const postRestult = CortexApi.proxyFetch(cdUrl, 
              {
                  method: 'POST',
                  body: JSON.stringify({
                      "key": "checklist",
                      "value": 
                               [{
                                  "date": Date(),
                                  "signed_by": currentUser,
                                  "ada": ada,
                                  "itar": itar,
                                  "pii": pii
      
      
                              }]
      
                  }),
              });
              const jResult = JSON.stringify(postRestult);
              // if ((await postRestult).ok){
                alert("Successfully updated")
                window.location.reload()
              // }
              console.log(jResult);
  
          }
          catch (error){
            console.log(error.message)
          }
          



        }
      
         
    const options = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No'},
        { value: `N/A`, label: `N/A`}
      ]  
    const config = {
        columns: [
      {
        Cell: (date: string) => (
          <Box>
            <Text>{date}</Text>
          </Box>
        ),
        accessor: "date",
        id: "date",
        title: "Date",
        width: "25%",
      },
      {
        Cell: (signedBy: string) => (
          <Box>
            <Text>{signedBy}</Text>
          </Box>
        ),
        accessor: "signed_by",
        id: "signed_by",
        title: "Signed By",
        width: "35%",
      },
      {
        Cell: (ada: string) => (
          <Box>
            <Text>{ada}</Text>
          </Box>
        ),
        accessor: "ada",
        id: "ada",
        title: "ADA Compliant",
        width: "15%",
      },
      {
        Cell: (itar: string) => (
          <Box>
            <Text>{itar}</Text>
          </Box>
        ),
        accessor: "itar",
        id: "itar",
        title: "ITAR Compliant",
      },
      {
        Cell: (itar: string) => (
          <Box>
            <Text>{itar}</Text>
          </Box>
        ),
        accessor: "pii",
        id: "pii",
        title: "No PII",
      }
    ],
  };

return isLoading ? (
    <Loader />
    ) : ( <div> 
          { hasList ? (<div><h2>Attestation for this {entityType}</h2><SimpleTable config={config} items={posts} /></div>) :
                    (<Box backgroundColor="light" padding={3} borderRadius={2}>
                        <Text>
                         No Attestations has been submitted to this service
                        </Text>
                    </Box>)
          }
          <br/>
          <br/>
          
          { isOwner && (
            <div><Input 
              type="checkbox"
              id="checkbox"
              checked={isChecked} 
              onChange={checkHandler}
              />
              <label htmlFor="checkbox">Submit New Attestation </label>
              <br/>
            </div>)
          }  
          
          { isChecked && (
            <div>
                <Text>This Service is ADA compliant  </Text>  
                <br/>
                <div  style={{width: '100px'}}><Select  id="ada-select" options={options} onChange={adaHandler} /></div>
                <br/>
                <Text>This Service is ITAR compliant  </Text>
                <br/>  
                <div  style={{width: '100px'}}><Select  id="itar-select" options={options} onChange={itarHandler} /></div>
                <br/>
                <Text>This Service does not process or use customer PII</Text>
                <br/>  
                <div  style={{width: '100px'}}><Select  id="pii-select" options={options} onChange={piiHandler} /></div>
                <br/>
                <br/>
                <Text> By clicking on the button below, I {currentUser} attest that the above information is accurate</Text>
                <br/>
                <br/>
                
                
                
                <Button type="submit" onClick={() => {
                  postData();
                 }
                }>Submit Attestation</Button>    
            </div>
          )
          }
        </div>
          
   
    );
  
};

export default Attestation;