
const sampleStory = [{
  _source: {
    "message_guid": "d09ab0fa-5a9f-4ff6-afb5-3b6abd8ca9f8",
    "start_date": "2018-03-03T11:59:42.17+02:00",
    "end_date":   "2018-03-03T11:59:42.19+02:00",
    "phase_name": "Transport",
    "status": "Success",
    "service_id": 2,
    "service_name": "Service B",
    "environment": "External",
    "client_ip": "130.157.232.158",
    "client_user": "Gleason.Vito",
    "message" : "Message received",
    "payload":"<SOAP-ENV:Envelope xmlns:xsi='http://www.w3.org/1999/XMLSchema/instance' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope' xsi:schemaLocation='http://www.northwindtraders.com/schemas/NPOSchema.xsd'> <SOAP-ENV:Body xsi:type='NorthwindBody'> <UpdatePO> <orderID>0</orderID> <customerNumber>999</customerNumber> <item>89</item> <quantity>3000</quantity> <return>0</return> </UpdatePO> </SOAP-ENV:Body> </SOAP-ENV:Envelope>"
  }
}, {
  _source: {
    "message_guid": "d09ab0fa-5a9f-4ff6-afb5-3b6abd8ca9f8",
    "start_date": "2018-03-03T11:59:42.20+02:00",
    "end_date":   "2018-03-03T11:59:42.25+02:00",
    "phase_name": "ServiceProcessing",
    "status": "Success",
    "service_id": 2,
    "service_name": "Service B",
    "environment": "External",
    "client_ip": "130.157.232.158",
    "client_user": "Gleason.Vito",
    "message" : "Message analyzed",
    "payload":"<SOAP-ENV:Envelope xmlns:xsi='http://www.w3.org/1999/XMLSchema/instance' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope' xsi:schemaLocation='http://www.northwindtraders.com/schemas/NPOSchema.xsd'> <SOAP-ENV:Body xsi:type='NorthwindBody'> <UpdatePO> <orderID>0</orderID> <customerNumber>999</customerNumber> <item>89</item> <quantity>3000</quantity> <return>0</return> </UpdatePO> </SOAP-ENV:Body> </SOAP-ENV:Envelope>"
  }
}, {
  _source: {
    "message_guid": "d09ab0fa-5a9f-4ff6-afb5-3b6abd8ca9f8",
    "start_date": "2018-03-03T11:59:42.44+02:00",
    "end_date":   "2018-03-03T11:59:43.07+02:00",
    "phase_name": "Cross-domain transport",
    "status": "Failure",
    "service_id": 2,
    "service_name": "Service B",
    "environment": "Internal",
    "client_ip": "130.157.232.158",
    "client_user": "Gleason.Vito",
    "message" : "Message nas been transmitted",
    "payload":"<SOAP-ENV:Envelope xmlns:xsi='http://www.w3.org/1999/XMLSchema/instance' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope' xsi:schemaLocation='http://www.northwindtraders.com/schemas/NPOSchema.xsd'> <SOAP-ENV:Body xsi:type='NorthwindBody'> <UpdatePO> <orderID>0</orderID> <customerNumber>999</customerNumber> <item>89</item> <quantity>3000</quantity> <return>0</return> </UpdatePO> </SOAP-ENV:Body> </SOAP-ENV:Envelope>"
  }
}
]

module.exports = sampleStory;
