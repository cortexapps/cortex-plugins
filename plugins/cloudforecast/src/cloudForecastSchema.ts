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
  const isISODateString = (value: any): boolean =>
    isString(value) && !isNaN(Date.parse(value));
  const isYYYYMMDD = (value: any): boolean =>
    isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const isYYYYMM = (value: any): boolean =>
    isString(value) && /^\d{4}-\d{2}$/.test(value);
  const isStatus = (value: any): boolean =>
    value === "cloudy" || value === "stormy";

  const isCloudForecastLinks = (links: any): links is CloudForecastLinks =>
    links && isString(links.mostRecentReportDeepLink);

  const isCloudForecastDayMetrics = (
    metrics: any
  ): metrics is CloudForecastDayMetrics =>
    metrics && isNumber(metrics.cost) && isYYYYMMDD(metrics.dayAsStr);

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
    metrics && isNumber(metrics.cost) && isYYYYMM(metrics.monthAsStr);

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
    (alert.report_date === undefined || isYYYYMMDD(alert.report_date)) &&
    (alert.description === undefined || isString(alert.description)) &&
    (alert.whyDeepLink === undefined || isString(alert.whyDeepLink)) &&
    (alert.status === undefined || isStatus(alert.status));

  return (
    typeof data === "object" &&
    data !== null &&
    isString(data.entityTag) &&
    isISODateString(data.generatedAt) &&
    (data.dataFormatVersion === undefined ||
      isString(data.dataFormatVersion)) &&
    isCloudForecastLinks(data.links) &&
    isCloudForecastDailyMetrics(data.dailyMetrics) &&
    isCloudForecastMonthlyMetrics(data.monthlyMetrics) &&
    (data.recentAlerts === undefined ||
      (Array.isArray(data.recentAlerts) &&
        data.recentAlerts.every(isCloudForecastRecentAlert)))
  );
};
