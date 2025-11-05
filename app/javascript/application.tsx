import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.getElementById('root');

	if (!rootElement) {
		console.error("Root element with ID 'root' not found in the DOM.");
		return;
	}

	const root = createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
});
