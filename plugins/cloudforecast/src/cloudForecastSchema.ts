export interface CloudForecastData {
  entityTag: string;
  generatedAt: string; // ISO date-time format
  dataFormatVersion?: string;
  links: CloudForecastLinks;
  dailyMetrics: CloudForecastDailyMetrics;
  monthlyMetrics: CloudForecastMonthlyMetrics;
  recentAlerts?: CloudForecastRecentAlert[];
}

export interface CloudForecastLinks {
  mostRecentReportDeepLink: string;
}

export interface CloudForecastDailyMetrics {
  mostRecentDay: CloudForecastDayMetrics;
  previousDay?: CloudForecastDayMetrics;
  sevenDayAverage?: number;
  thirtyDayAverage?: number;
}

export interface CloudForecastDayMetrics {
  cost: number;
  dayAsStr: string; // Matches YYYY-MM-DD
}

export interface CloudForecastMonthlyMetrics {
  currentMonth: CloudForecastMonthMetrics;
  previousMonth?: CloudForecastMonthMetrics;
  endOfMonthForecast: number;
  monthlyBudget?: number;
}

export interface CloudForecastMonthMetrics {
  cost: number;
  monthAsStr: string; // Matches YYYY-MM
}

export interface CloudForecastRecentAlert {
  report_date?: string; // Matches YYYY-MM-DD
  description?: string;
  whyDeepLink?: string;
  status?: "cloudy" | "stormy";
}

export const isCloudForecastData = (data: any): data is CloudForecastData => {
  const isString = (value: any): boolean => typeof value === "string";
  const isNumber = (value: any): boolean => typeof value === "number";

  const isCloudForecastDayMetrics = (
    metrics: any
  ): metrics is CloudForecastDayMetrics =>
    metrics && isNumber(metrics.cost) && isString(metrics.dayAsStr);

  const isCloudForecastDailyMetrics = (
    metrics: any
  ): metrics is CloudForecastDailyMetrics =>
    metrics &&
    isCloudForecastDayMetrics(metrics.mostRecentDay) &&
    (!metrics.previousDay || isCloudForecastDayMetrics(metrics.previousDay)) &&
    (metrics.sevenDayAverage === undefined ||
      isNumber(metrics.sevenDayAverage)) &&
    (metrics.thirtyDayAverage === undefined ||
      isNumber(metrics.thirtyDayAverage));

  const isCloudForecastMonthMetrics = (
    metrics: any
  ): metrics is CloudForecastMonthMetrics =>
    metrics && isNumber(metrics.cost) && isString(metrics.monthAsStr);

  const isCloudForecastMonthlyMetrics = (
    metrics: any
  ): metrics is CloudForecastMonthlyMetrics =>
    metrics &&
    isCloudForecastMonthMetrics(metrics.currentMonth) &&
    (!metrics.previousMonth ||
      isCloudForecastMonthMetrics(metrics.previousMonth)) &&
    isNumber(metrics.endOfMonthForecast) &&
    (metrics.monthlyBudget === undefined || isNumber(metrics.monthlyBudget));

  const isCloudForecastRecentAlert = (
    alert: any
  ): alert is CloudForecastRecentAlert =>
    alert &&
    (alert.report_date === undefined || isString(alert.report_date)) &&
    (alert.description === undefined || isString(alert.description)) &&
    (alert.whyDeepLink === undefined || isString(alert.whyDeepLink)) &&
    (alert.status === undefined || isString(alert.status));

  return (
    typeof data === "object" &&
    data !== null &&
    isString(data.entityTag) &&
    isString(data.generatedAt) &&
    (data.dataFormatVersion === undefined ||
      isString(data.dataFormatVersion)) &&
    isCloudForecastDailyMetrics(data.dailyMetrics) &&
    isCloudForecastMonthlyMetrics(data.monthlyMetrics) &&
    (data.recentAlerts === undefined ||
      (Array.isArray(data.recentAlerts) &&
        data.recentAlerts.every(isCloudForecastRecentAlert)))
  );
};
