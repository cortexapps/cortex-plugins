import type React from "react";
import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CortexApi } from "@cortexapps/plugin-core";
import { Loader } from "@cortexapps/plugin-core/components";

ChartJS.register(ArcElement, Tooltip, Legend);

const supportedLanguages = [
  "C",
  "C++",
  "C#",
  "Go",
  "Java",
  "JavaScript",
  "PHP",
  "Python",
  "Ruby",
  "Scala",
  "Swift",
  "TypeScript",
  "Kotlin",
  "Rust",
];

const languages: any[] = [];
let chartDataSet: ChartData;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const checkResult = async (jobId: number) => {
  const response = await CortexApi.proxyFetch(
    `https://api.getcortexapp.com/api/v1/queries/${jobId}`
  );
  const json = await response.json();
  if (json.status === "DONE") {
    return json.result.length;
  }
  return null;
};

const sleep = async (ms: number): Promise<any> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const cacheData = (data: ChartData): void => {
  localStorage.setItem("cortex-tech-radar", JSON.stringify(data));
};

const getLanguageCount = async (
  language: string,
  updateData
): Promise<void> => {
  const response = await CortexApi.proxyFetch(
    `https://api.getcortexapp.com/api/v1/queries`,
    {
      method: "POST",
      body: JSON.stringify({
        cqlVersion: "1.0",
        query: `git.top_language = "${language}"`,
      }),
    }
  );
  const result = await response.json();
  const jobId = result.jobId;
  let res = null;
  while (res == null) {
    res = await checkResult(jobId);
    if (res == null) {
      await sleep(1000);
    } else {
      if (res > 0) languages.push({ language, count: res });
      const labels: any = chartDataSet?.labels;
      let data: any = chartDataSet?.datasets[0].data;
      languages.forEach((language) => {
        if (
          chartDataSet?.labels !== undefined &&
          (chartDataSet?.labels as any).indexOf(language.language)
        ) {
          data = chartDataSet?.datasets[0].data;
          data[chartDataSet?.labels?.indexOf(language.language)] =
            language.count;
        } else {
          labels.push(language.language);
          data.push(language.count);
        }
      });
      const updatedData = {
        labels,
        datasets: [
          {
            label: "Top Languages",
            data,
            backgroundColor: [
              "rgb(237, 232, 254)",
              "rgb(255, 233, 237)",
              "rgb(247, 153, 0)",
              "rgb(232, 244, 255)",
              "rgb(234, 247, 224)",
              "rgb(252, 198, 0)",
              "rgb(118, 80, 233)",
              "rgb(242, 124, 171)",
              "rgb(241, 80, 109)",
            ],
            borderWidth: 0,
          },
        ],
      };
      updateData(updatedData);
      cacheData(updatedData);
    }
  }
};

const fetchRepoLanguages = async (updateData, setLoading): Promise<void> => {
  const promises: Array<Promise<any>> = [];
  supportedLanguages.forEach((language) => {
    promises.push(getLanguageCount(language, updateData));
  });
  await Promise.all(promises);
  setLoading(false);
};

const TechRadar: React.FC = () => {
  const [data, updateData] = useState(
    localStorage.getItem("cortex-tech-radar")
      ? (JSON.parse(
          localStorage.getItem("cortex-tech-radar") as string
        ) as ChartData<"doughnut", never[], never>)
      : {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: [],
              borderWidth: 0,
            },
          ],
        }
  );
  const [loading, setLoading] = useState(true);
  chartDataSet = data;

  useEffect(() => {
    (async () => {
      await fetchRepoLanguages(updateData, setLoading);
    })().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <ErrorBoundary>
      {loading && (
        <Loader
          centered={true}
          disableText={false}
          size={30}
          small={true}
          text={"Updating tech radar data..."}
          top={true}
        />
      )}
      <div style={{ height: "400px" }}>
        <Doughnut data={data} />
      </div>
    </ErrorBoundary>
  );
};

export default TechRadar;
