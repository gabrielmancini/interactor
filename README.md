# interaction-tracker
A simple website user-interaction tracker. 

Collects usage data and submits it to a user-defined server endpoint on the beforeunload event. 

Great for creating a database to drive analytics and inform A/B testing and other site optimization decisions.

Contributions welcome!

## Example Usage

Include the script in your HTML and invoke it. 

'''html
	<!DOCTYPE html>
	<html>
		<head>
			<title>Interaction Tracker Example</title>
		</head>
		<body>
			<div class="interaction"></div>
			<div class="interaction"></div>
			<div class="interaction"></div>
			<div class="conversion"></div>
			<script src="interaction.js" type="application/javascript"></script>
			<script>
				// An example instatiation with custom arguments
				var interactions = new Interaction({
					interactions 		: true,
					interactionElement 	: "interaction",
					interactionEvents 	: ["mousedown", "mouseup", "touchstart", "touchend"],
					conversions 		: true,
					conversionElement 	: "conversion",
					conversionEvents 	: ["mouseup", "touchend"],
					endpoint 			: '/usage/interactions'
				});
			</script>
		</body>
	</html>
'''

To track a users interactions with an element, simply add the class '.interaction' class to the element!

Have a conversion point on your page? You can add that too with the '.conversion' class. 

Want to track a user's interactions with different element classes already on your page? Create multiple instances and allow each to target the page elements you're interested in. 

## Default Parameters
		interactions 		= true,
		interactionElement 	='interaction',
		interactionEvents 	= ['mouseup', 'touchend'],
		conversions 		= false,
		conversionElement 	= 'conversion',
		conversionEvents 	= ['mouseup', 'touchend'],
		endpoint 			= '/interactions',