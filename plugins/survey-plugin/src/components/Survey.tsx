import React from "react";
import { Loader, usePluginContext } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import { PluginContextLocation } from "@cortexapps/plugin-core";

// Update this with your default/Global Survey Form
const defaultSurvey =
  "https://docs.google.com/forms/d/e/1FAIpQLSd068wYDvfxbhB75fTx-KM7aWb9gNiLLcnjA6SQ4ulT9SLgqA/viewform?embedded=true";

const Survey: React.FC = () => {
  const context = usePluginContext();
  console.log(context);
  const [entitySurvey, setEntitySurvey] = React.useState<any | string>();
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  React.useEffect(() => {
    if (context.location === PluginContextLocation.Entity) {
      const fetchData = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cortexTag = context.entity!.tag;
        console.log(cortexTag);
        const cortexURL = context.apiBaseUrl;
        console.log(cortexURL);
        const result = await fetch(
          `${cortexURL}/catalog/${cortexTag}/custom-data/survey`
        );
        if (result.ok) {
          const resultJson = await result.json();
          console.log({ resultJson });
          console.log(defaultSurvey);
          setEntitySurvey(resultJson.value);
        } else {
          setEntitySurvey(defaultSurvey);
        }
        setIsLoading(false);
      };
      void fetchData();
    }
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <iframe src={entitySurvey ?? defaultSurvey} height="2967px" />
  );
};
export default Survey;
