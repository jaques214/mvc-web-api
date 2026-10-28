export * from './utils';

export const WMO_WEATHER_CODES: Record<string, {
	condition: string;
	icon: string;
}> = {
	"0": {condition: "Clear sky", icon: "sunny"},
	"1": {condition: "Mainly clear", icon: "sunny"},
	"2": {condition: "Partly cloudy", icon: "cloudy"},
	"3": {condition: "Overcast", icon: "cloudy"},
	"45": { condition: "Fog", icon: "fog"},
	"48": { condition: "Depositing rime fog", icon: "fog"},
	"51": { condition: "Light drizzle", icon: "showers"},
	"53": { condition: "Moderate drizzle", icon: "showers"},
	"55": { condition: "Dense drizzle", icon: "showers"},
	"56": { condition: "Light freezing drizzle", icon: "showers"},
	"57": { condition: "Dense freezing drizzle", icon: "showers"},
	"61": { condition: "Slight rain", icon: "rain"},
	"63": { condition: "Moderate rain", icon: "rain"},
	"65": { condition: "Heavy rain", icon: "rain"},
	"66": { condition: "Light freezing rain", icon: "sleet"},
	"67": { condition: "Heavy freezing rain", icon: "sleet"},
	"71": { condition: "Slight snowfall", icon: "snow"},
	"73": { condition: "Moderate snowfall", icon: "snow"},
	"75": { condition: "Heavy snowfall", icon: "snow"},
	"77": { condition: "Snow grains", icon: "snow"},
	"80": { condition: "Slight rain showers", icon: "showers"},
	"81": { condition: "Moderate rain showers", icon: "showers"},
	"82": { condition: "Violent rain showers", icon: "showers"},
	"85": { condition: "Slight snow showers", icon: "show"},
	"86": { condition: "Heavy snow showers", icon: "show"},
	"95": { condition: "Thunderstorm", icon: "thunderstorm"},
	"96": { condition: "Thunderstorm with slight hail", icon: "thunderstorm"},
	"97": { condition: "Heavy thunderstorm", icon: "thunderstorm"},
	"99": { condition: "Thunderstorm with heavy hail", icon: "thunderstorm"}
}

export const API_ENDPOINT = 'http://localhost:3000';
export const ANGULAR_ENDPOINT = 'http://localhost:4200';