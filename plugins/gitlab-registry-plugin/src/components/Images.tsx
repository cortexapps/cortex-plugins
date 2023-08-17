import React from "react";
import {
  SimpleTable,
  Box,
  Text,
  Loader,
  usePluginContext,
} from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import { PluginContextLocation } from "@cortexapps/plugin-core";


// Set your Gitlab url. Cloud is https://gitlab.com
const glURL = `https://gitlab.com/`;
// Boolean to check if service has GitLab configured
let hasGitLab: boolean = false;
const Images: React.FC = () => {
  const context = usePluginContext();
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity );
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexTag = context.entity!.tag;
      const cortexURL = context.apiBaseUrl;
      const result = await fetch(`${cortexURL}/catalog/${cortexTag}/openapi`);
      const resultJson = await result.json();
      try {
        if (resultJson.info?.["x-cortex-git"].gitlab.repository !== undefined) {
            hasGitLab = true;
            // If we have a GitLab tag, we assume there is a repo defined, let's get the value
            const glRepo: string =
                resultJson.info["x-cortex-git"].gitlab.repository
            // A gitlab repo is usually in the owner/project format and 
            // we can't use the slash (/) in the API URL 
            const encodedRepo = glRepo.replace("/", "%2F");
            const url: string = `${glURL}api/v4/projects/${encodedRepo}/registry/repositories?tags=true`;
            const iResult = await fetch(url);
            const jResult = await iResult.json();
            // let's create a new array that we can fill with the name of the image, location and the tag.
            const jsonObj = [{}];
            // As we populate the array we need to keep track of the row
            let rowNum = 0;
            for (
              let j = 0;
              j < jResult.length;
              j++ 
            ) {              
              const imageName = jResult[j].name;
              // For each image info in the JSON response
              // There is an array that contains the tags
              const tagArray = jResult[j].tags;
              // For each image we'll have a row with the image name
              // and then a row for each tag associated to the image
              // Here we define the row that contains the name of the image 
              const imageHeader = {
                p: imageName,
                d: "",
              };
              // Add the row to the Array
              jsonObj[rowNum] = Object.assign(imageHeader);
              rowNum++;
              
              for (let i = 0; i < tagArray.length; i++) {
                const imageTag: string = tagArray[i].name;
                // we want to the sha and date associated to the tag, so we need another call
                // const tagUrl: string = `${glURL}api/v4/projects/${encodedRepo}/registry/repositories/${repoID}/tags/${imageTag}`;
                // const tagResult = await fetch(tagUrl);
                // const jtagResult = await tagResult.json();
    
                const imageDetails = {
                  p: tagArray[i].location,
                  t: imageTag,
                };
    
                jsonObj[rowNum] = Object.assign(imageDetails);
                rowNum++;
                // we want to add an empty line after the last tag for an image
                // for readability
                if (i === tagArray.length - 1) {
                  const emptyString = {
                    p: "",
                    t: "",
                  };
                  jsonObj[rowNum] = Object.assign(emptyString);
                  rowNum++;
                }
              }
            }
            setPosts(jsonObj);
          }
        }
        catch (error)
        {
            console.log(error.message)
        }
        setIsLoading(false);
    };
    void fetchData();
  }, []);

  const config = {
    columns: [
      {
        Cell: (path: string) => (
          <Box>
            <Text>{path}</Text>
          </Box>
        ),
        accessor: "p",
        id: "p",
        title: "Name",
        width: "75%",
      },
      {
        Cell: (tag: string) => (
          <Box>
            <Text>{tag}</Text>
          </Box>
        ),
        accessor: "t",
        id: "t",
        title: "Tag",
        width: "25%",
      },
    ],
  };

  if (hasGitLab) {
    return isLoading ? (
        <Loader />
      ) : ( 
    <SimpleTable config={config} items={posts} />
    );
  } else {
    return isLoading ? (
        <Loader />
      ) : (
      <Box backgroundColor="light" padding={3} borderRadius={2}>
        <Text>
          This service does not have a GitLab Repo defined in the Service YAML
          or the GitLab Access Token does not have access to the repository
          specified.
        </Text>
      </Box>
    );
    
  }
};

export default Images;
