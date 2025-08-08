# Dynamic-form-builder-app

A powerful Angular application for creating and managing custom form templates with a drag-and-drop interface, role-based access control, and real-time form validation.

## Features

### Form Builder Interface
- Drag-and-drop interface for building forms
- Support for various field types:
  - Text input (single-line and multi-line)
  - Dropdown select
  - Checkbox groups
  - Date picker
  - Radio button groups
- Configurable field properties:
  - Field label
  - Required/optional setting
  - Help text
  - Validation rules

### Form Management
- List view of created form templates
- Edit existing templates
- Preview forms before publishing

### Form Submission
- User-friendly form filling interface
- Real-time validation
- Submission to mock API
- View submitted form data

### Authorization
- Two user roles:
  - Admin: Create, edit, and delete form templates
  - User: View and fill out forms
- Role-based access control
- Secure login system

## Technical Stack
- Angular 20+ with TypeScript (zoneless application)
- NgRx for state management
- Angular Material for UI components
- Reactive Forms for form handling
- Angular CDK for drag-and-drop functionality

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository
2. Navigate to the project directory: `cd form-builder-app`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Open your browser and navigate to `http://localhost:4200`

### Demo Credentials
- Admin:
  - Username: admin
  - Password: password
- User:
  - Username: user
  - Password: password

## Development

### Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests
Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
