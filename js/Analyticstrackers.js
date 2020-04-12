/**
* Function that registers a click on an outbound link in Analytics.
* This function takes a valid URL string as an argument, and uses that URL string
* as the event label. Setting the transport method to 'beacon' lets the hit be sent
* using 'navigator.sendBeacon' in browser that support it.
*/
var getLinks = function(coming_from, url) {
  gtag('event', 'link', {
    'event_category': coming_from,
    'event_label': url,
    'transport_type': 'beacon',
    'event_callback': function(){document.location = url;}
  });
}

var getbuttons = function(button, situation, url) {
  gtag('event', button, {
    'event_category': situation,
    'event_label': url,
    'transport_type': 'beacon',
    'event_callback': function(){console.log(1)}
  });
}