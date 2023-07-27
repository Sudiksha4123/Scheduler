import 'smart-webcomponents-react/source/styles/smart.default.css';
import axios from 'axios';
import swal from 'sweetalert2';

export function createField(labelText, inputElement) {
	const fieldContainer = document.createElement('div');
	fieldContainer.classList.add('field-container');
  
	const label = document.createElement('label');
	label.innerText = labelText;
	fieldContainer.appendChild(label);
  
	fieldContainer.appendChild(inputElement);
  
	return fieldContainer;
  }
  
  export function createInputField(value, onChange) {
	const input = document.createElement('input');
	input.type = 'text';
	input.value = value;
	input.addEventListener('change', onChange);
  
	return input;
  }

  export function createDateField(value, onChange) {
	const input = document.createElement('input');
	input.type = 'date';
	input.value = value;
	input.addEventListener('change', onChange);
  
	return input;
  }
  
  export function createTextAreaField(value, onChange) {
	const textarea = document.createElement('textarea');
	textarea.value = value;
	textarea.addEventListener('change', onChange);
  
	return textarea;
  }
  
  export function createTimeField(value, onChange) {
	const input = document.createElement('input');
	input.type = 'time';
	input.value = value;
	input.addEventListener('change', onChange);
  
	return input;
  }
  
//   export function formatTime(timeString) {
// 	const [hours, minutes] = timeString.split(':');
// 	const timeDate = new Date();
// 	timeDate.setHours(Number(hours), Number(minutes));
// 	return timeDate;
//   }

// export function createPriorityField(event, updateEvent) {
// 	return (
// 	  <div>
// 		<label>Priority:</label>
// 		<select
// 		  value={event.priority}
// 		  onChange={(e) => {
// 			const newEvent = { ...event, priority: e.target.value };
// 			updateEvent(newEvent); // Call the updateEvent function to update the event in the state
// 		  }}
// 		>
// 		  <option value="low" style={{ color: 'green' }}>
// 			Low
// 		  </option>
// 		  <option value="medium" style={{ color: 'orange' }}>
// 			Medium
// 		  </option>
// 		  <option value="high" style={{ color: 'red' }}>
// 			High
// 		  </option>
// 		</select>
// 	  </div>
// 	);
//   }
  

  export function submitEvent(eventData, scheduler,newEvent) {
	// Add code here to submit the eventData to the backend
	// For example, you can use axios to make an HTTP POST request to the backend API
	axios.post('/event/api/events', eventData)
	  .then(response => {
		// Handle the response from the backend if needed
		swal.fire('Success', 'Event has been submitted.', 'success');
		scheduler.closeWindow(); // Close the custom window after successful submission

		if (newEvent) {
			scheduler.dataSource.push(eventData);
		  }
	  })
	  .catch(error => {
		// Handle any errors that occur during the HTTP request
		swal.fire('Error', 'Failed to submit event.', 'error');
	  });
  }

  export function fetchEvents() {
	return axios.get('/event/api/allevents')
	  .then(response => response.data)
	  .catch(error => {
		console.error('Error fetching events:', error);
		return [];
	  });
  }
  