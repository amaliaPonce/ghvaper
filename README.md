# GH Vaper

GH Vaper is a small Express server that receives order forms, calculates a price estimate, and emails the results to the customer and administrator. It can be deployed to Azure Web Apps via the included GitHub Actions workflow.

## Features

- **Order Processing** – Accepts POST requests on `/formulario` with information about the order and sends a confirmation email.
- **Price Calculation** – Calculates the order cost based on model, quantity and optional extras.
- **Email Notifications** – Uses SMTP credentials to send messages to both the user and an admin address.
- **Environment Validation** – Startup checks ensure that all required configuration variables are present.
- **Centralized Error Handling** – Consistent error responses through Express middleware.

## Requirements

- Node.js 20 or later
- An SMTP account for sending mail
- An Azure Web App if you plan to deploy using the provided workflow

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and adjust the values:
   ```bash
   cp .env.example .env
   # then edit .env with your editor of choice
   ```
3. Start the server locally:
   ```bash
   npm start
   ```
   The server listens on the port defined in `PORT` (defaults to 8080).

## Environment Variables

The application relies on several variables which must be defined in the `.env` file:

| Variable | Description |
| -------- | ----------- |
| `PORT` | Port the Express server will listen on. |
| `SMTP_HOST` | Hostname of your SMTP provider. |
| `SMTP_PORT` | SMTP port (usually 465 or 587). |
| `SMTP_USER` | Username for the SMTP account. |
| `SMTP_PASSWORD` | Password for the SMTP account. |
| `ADMIN_EMAIL` | Email address that receives a copy of each order. |

See `.env.example` for a template.

## Usage

Send a POST request to `/formulario` with JSON data matching the following structure:

```json
{
  "nombre": "Juan",
  "email": "juan@example.com",
  "telefono": "123456789",
  "modelo": "modelo1",
  "cantidad": 100,
  "personalizacion": true,
  "lanyard": false,
  "stand": "Córdoba"
}
```

If the payload is valid, the server will calculate the price and email both the customer and the admin.

## Deployment

On every push to the `main` branch, GitHub Actions builds the project and deploys it to Azure Web Apps using the publish profile stored in repository secrets. You can review `.github/workflows/main_ghvaper.yml` for details.

## Contributing

Pull requests are welcome! Please open an issue first to discuss any major changes. Be sure not to commit real credentials or other sensitive data.

