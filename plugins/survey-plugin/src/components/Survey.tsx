import React from "react";
import { Loader, usePluginContext } from "@cortexapps/plugin-core/components";
import "../baseStyles.css";
import { PluginContextLocation } from "@cortexapps/plugin-core";

// Update this with your default/Global Survey Form
const defaultSurvey =
  "https://docs.google.com/forms/d/e/1FAIpQLSd068wYDvfxbhB75fTx-KM7aWb9gNiLLcnjA6SQ4ulT9SLgqA/viewform?embedded=true";

const Survey: React.FC = () => {
  const context = usePluginContext();
  const [entitySurvey, setEntitySurvey] = React.useState<any | string>();
  const [isLoading, setIsLoading] = React.useState(
    context.location === PluginContextLocation.Entity
  );
  React.useEffect(() => {
    if (context.location === PluginContextLocation.Entity) {
      const fetchData = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cortexTag = context.entity!.tag;
        const cortexURL = context.apiBaseUrl;
        const result = await fetch(
          `${cortexURL}/catalog/${cortexTag}/custom-data/survey-url`
        );
        if (result.ok) {
          const resultJson = await result.json();
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
    // use the default survey url if the plugin is running on the global context or
    // we can't find a survey-url custom data key
    <iframe src={entitySurvey ?? defaultSurvey} height="2967px" />
  );
};
export default Survey;
