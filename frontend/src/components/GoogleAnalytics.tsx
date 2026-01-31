import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const GA_TRACKING_ID = "G-C5H0Y9MBS3";

const GoogleAnalytics = () => {
	const location = useLocation();

	useEffect(() => {
		// Inicializa o GA apenas uma vez
		ReactGA.initialize(GA_TRACKING_ID);
		console.log("Google Analytics Inicializado com o ID:", GA_TRACKING_ID);
	}, []);

	useEffect(() => {
		// Rastreia a mudança de página
		const path = location.pathname + location.search;
		ReactGA.send({ hitType: "pageview", page: path });
		console.log("GA: Enviando visualização de página para:", path);
	}, [location]);

	return null;
};

export default GoogleAnalytics;
