//New calendar component
import 'smart-webcomponents-react/source/styles/smart.default.css';
import React from "react";
import { Button } from 'smart-webcomponents-react/button';
import { Input } from 'smart-webcomponents-react/input';
import { Tree, TreeItem, TreeItemsGroup } from 'smart-webcomponents-react/tree';
import { Scheduler } from 'smart-webcomponents-react/scheduler';
import {createField,createInputField,createDateField,createTextAreaField,createTimeField,formatTime,createPriorityField,submitEvent,fetchEvents} from './newEvent';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.scheduler = React.createRef();
		this.calendar = React.createRef();
		this.tree = React.createRef();
		this.primaryContainer = React.createRef();
		this.state = {
			events: [], // Initialize an empty array for the events data in the component state
		  };
    
		const today = new Date(),
			currentDate = today.getDate(),
			currentYear = today.getFullYear(),
			currentMonth = today.getMonth(),
			currentHours = today.getHours(),
			currentMinutes = today.getMinutes()			
	
	}

	view = 'month';

	views = ['day',
		{
			type: 'week',
			hideWeekend: true,
		},
		{
			type: 'month',
			hideWeekend: true,
		}, 'agenda',
		
	];

	firstDayOfWeek = 1;

	disableDateMenu = true;

	currentTimeIndicator = true;

	scrollButtonsPosition = 'near';

	getPastThreeWeekdays(weekday) {
		let weekdays = [];

		for (let i = 0; i < 3; i++) {
			weekdays.push((weekday - i + 7) % 7);
		}

		return weekdays;
	}
    //To update data source
	updateData(event) {
		const item = event.detail.item,
		  data = this.scheduler.current.dataSource;
	  
		// Check if the item exists in the data array
		const existingItemIndex = data.findIndex((dataItem) => dataItem.label === item.label && dataItem.class === item.class);
	  
		if (event.type === 'itemRemove') {
		  // If it's a removal event, remove the item from the data array
		  if (existingItemIndex !== -1) {
			data.splice(existingItemIndex, 1);
		  }
		} else {
		  // If it's an update or new event, add or update the item in the data array
		  if (existingItemIndex !== -1) {
			data[existingItemIndex] = item;
		  } else {
			data.push(item);
		  }
		}
	  }
	  

	addNew() {
		this.scheduler.current.openWindow({
			class: 'event'
		});
	}

	handleCalendarChange(event) {
		this.scheduler.current.dateCurrent = event.detail.value;
	}

	handleTreeChange() {
    const tree = this.tree.current;
    const selectedIndexes = tree.selectedIndexes;
    const promises = [];
  
    for (let i = 0; i < selectedIndexes.length; i++) {
      promises.push(tree.getItem(selectedIndexes[i]));
    }
  
    Promise.all(promises)
      .then(results => {
        const types = results.map(result => result.value);
        this.scheduler.current.dataSource = this.data.filter(d => types.indexOf(d.class) > -1);
      })
      .catch(error => {
        // Handle any errors that occur during the Promise.all operation
      });
  }

  handleDateChange(event) {
    const selectedDate = event.detail.value;
    console.log('Selected date:', selectedDate);
  }

  // Function to customize the event window
  customizeSchedulerWindow(target, type, event) {
    // If the window is of type 'confirm', return (do not customize)
    if (type) {
      return;
    }

    const scheduler = this.scheduler.current,
      events = scheduler.events;

    target.footerPosition = 'none';
    target.label = event.label ? event.label : 'New Event';

    let container = target.querySelector('.custom-container');

    if (!container) {
      // Empty the window
      target.clear();
      container = document.createElement('div');
      container.classList.add('custom-container');
	   // Set custom window size and styles
	   container.style.width = '400px';
	   container.style.height = '350px';
	   container.style.padding = '20px';
	   container.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';
	   container.style.backgroundColor = 'white';
	   container.style.borderRadius = '8px';
	   container.style.display = 'flex';
	   container.style.flexDirection = 'column';
    }

    container.remove();
    container.innerHTML = '';

    // Custom fields for label, dateStart, dateEnd, time and description
  const labelField = createField('Label:', createInputField(event.label || '', (e) => {
    event.label = e.target.value;
  }));

  const dateStartField = createField('Start Date:', createDateField(event.dateStart.toISOString(), (e) => {
    event.dateStart = new Date(e.target.value);
  }));

  const TimeField = createField('Time:', createTimeField(event.time, (e) => {
    event.time = e.target.value;
  }));

  const dateEndField = createField('End Date:', createDateField(event.dateEnd.toISOString(), (e) => {
    event.dateEnd = new Date(e.target.value);
  }));


  const descriptionField = createField('Description:', createTextAreaField(event.description || '', (e) => {
    event.description = e.target.value;
  }));

//   const priorityField = createPriorityField(event, (updatedEvent) => {
// 	// Update the event in the state when the priority is changed
// 	this.setState({ events: this.state.events.map(e => e === event ? updatedEvent : e) });
//   });

	// Submit button
	const submitButton = document.createElement('button');
  submitButton.innerText = 'Submit';
  submitButton.addEventListener('click', () => {
    if (!scheduler.containsEvent(event)) {
          submitEvent(
			{
			  label: event.label,
			  dateStart: event.dateStart,
			  dateEnd: event.dateEnd,
			  time:event.time,
			  description: event.description,
			  //priority:event.priority,
			  // Add any other properties needed for your events
			},
			scheduler,
      true // Pass 'true' as the newEvent parameter for new events
		  );
      // A new event is being added
      this.scheduler.current.addEvent({
        label: event.label,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
		time:event.time,
        description: event.description,
		//priority:event.priority,
        // Add any other properties needed for your events
      });
    } else {
      // The existing event is being updated
      // Find the index of the existing event in the dataSource array
      const index = this.scheduler.current.dataSource.findIndex((item) => item === event);
      if (index !== -1) {
        // Update the existing event in the dataSource array
        this.scheduler.current.dataSource[index] = {
          label: event.label,
          dateStart: event.dateStart,
          dateEnd: event.dateEnd,
		  time:event.time,
          description: event.description,
		  //priority:event.priority,
          // Add any other properties needed for your events
        };
        submitEvent(
			{
			  label: event.label,
			  dateStart: event.dateStart,
			  dateEnd: event.dateEnd,
			  time:event.time,
			  description: event.description,
			  //priority:event.priority,
			  // Add any other properties needed for your events
			},
			scheduler,
			false // Pass 'false' as the newEvent parameter for existing events
		  );
      }
    }
    target.close();
  });

    container.appendChild(labelField);
    container.appendChild(dateStartField);
    container.appendChild(dateEndField);
	container.appendChild(TimeField);
    container.appendChild(descriptionField);
	//target.appendChild(priorityField); 
	container.appendChild(submitButton);

    if (!scheduler.containsEvent(event)) {
      // A cell is clicked. Show all events for the target cell
      for (let i = 0; i < events.length; i++) {
        const e = events[i];
        if (
          e.dateStart.getTime() >= event.dateStart.getTime() &&
          e.dateEnd.getTime() <= event.dateEnd.getTime()
        ) {
          container.appendChild(createField(events[i]));
        }
      }
    } else {
      // Event is clicked. Show the event
      container.appendChild(createField(event));
    }

    // Show placeholder if no events
    if (!container.innerHTML) {
      container.innerHTML = 'No events at this time';
    }

    target.appendChild(container);
  }


	componentDidMount() {
  fetchEvents()
    .then(events => {
      this.setState({ events }); // Set the fetched events to the component state
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
}


	render() {
		const { events } = this.state; // Retrieve events from the component state
		return (
             <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1px', backgroundColor: '#FFFFFF'}}>
                <h1 style={{ padding: '5px', backgroundColor: '#FFFFFF', color: 'black', borderRadius: '4px', cursor: 'pointer',height:'1px' }}>Academic Calendar</h1>
                <Button id="addNew" className="floating" onClick={this.addNew.bind(this)} style={{ padding: '8px',width:'200px', backgroundColor: '#f5f5f5', color: 'black', borderRadius: '4px', cursor: 'pointer' }}>
                  <span>New Event</span>
                </Button>
              </div>
              <div style={{ display: 'flex', flexGrow: 1 }}>
                
						<section style={{ width: '100%', padding: '10px'}}>
                  <div style={{ height: '100%', backgroundColor: '#f5f5f5' }}>
							<Scheduler ref={this.scheduler} id="scheduler" style={{height:'550px'}} dataSource={events} view={this.view} views={this.views} nonworkingDays={this.nonworkingDays}
								firstDayOfWeek={this.firstDayOfWeek}
								currentTimeIndicator={this.currentTimeIndicator}
								scrollButtonsPosition={this.scrollButtonsPosition} onDragEnd={this.updateData.bind(this)}
								onResizeEnd={this.updateData.bind(this)} onItemUpdate={this.updateData.bind(this)}
								onItemRemove={this.updateData.bind(this)} onDateChange={this.handleDateChange.bind(this)} allowResizing={true} windowCustomizationFunction={this.customizeSchedulerWindow.bind(this)} ></Scheduler>
                </div>
						</section>
					</div>
				</div>
      
		);
	}
}




export default App;
