/**
 * Google Apps Script for Contact Form Submission
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet with the following columns (in this exact order):
 *    A: Timestamp
 *    B: Name
 *    C: Email
 *    D: Country Code
 *    E: Phone Number
 *    F: Extension
 *    G: Affiliation
 *    H: Occupation
 *    I: Query Title
 *    J: Query Body
 *
 * 2. In your Google Sheet, go to Extensions > Apps Script
 *
 * 3. Delete any existing code and paste this entire script
 *
 * 4. Click "Deploy" > "New deployment"
 *    - Click the gear icon and select "Web app"
 *    - Description: "Contact Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 *
 * 5. Copy the Web App URL provided
 *
 * 6. In your index.html file (around line 1210), replace:
 *    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
 *    with:
 *    const GOOGLE_SCRIPT_URL = 'your-copied-web-app-url';
 *
 * 7. Test the form!
 */

// Handle POST requests from the contact form
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Prepare the row data in the correct order
    const rowData = [
      new Date(data.timestamp), // Timestamp
      data.name,                // Name
      data.email,               // Email
      data.countryCode,         // Country Code
      data.phone,               // Phone Number
      data.extension,           // Extension
      data.affiliation,         // Affiliation
      data.occupation,          // Occupation
      data.queryTitle,          // Query Title
      data.queryBody            // Query Body
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Optional: Send email notification to admin
    // Uncomment the lines below if you want to receive email notifications
    /*
    const emailBody = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.countryCode} ${data.phone}${data.extension ? ' Ext: ' + data.extension : ''}
Affiliation: ${data.affiliation || 'N/A'}
Occupation: ${data.occupation || 'N/A'}

Query Title: ${data.queryTitle}

Query Details:
${data.queryBody}

Submitted at: ${new Date(data.timestamp).toLocaleString()}
    `;

    MailApp.sendEmail({
      to: 'admin@blusigma.in', // Replace with your email
      subject: `New Contact Form: ${data.queryTitle}`,
      body: emailBody
    });
    */

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Form submitted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error
    Logger.log('Error: ' + error.toString());

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput('Contact Form Handler is running. Use POST requests to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}
