import axios from "axios";

const API_URL = "http://localhost:3000";

async function test() {
	try {
		const response = await axios.get(`${API_URL}/api/dialogues`, {
			params: { limit: 5 },
		});
		console.log(
			"API Sample Response:",
			JSON.stringify(response.data.data[0], null, 2),
		);
		if ("audioFileName" in response.data.data[0]) {
			console.log("SUCCESS: audioFileName IS present in API response.");
		} else {
			console.log("FAILURE: audioFileName is MISSING from API response.");
		}
	} catch (e) {
		console.error("API request failed:", e.message);
	}
}

test();
