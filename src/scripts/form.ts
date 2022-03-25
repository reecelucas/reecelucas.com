const form = document.querySelector("form");
const submitButton = document.querySelector(
  'button[type="submit"]'
) as HTMLButtonElement;

const ERROR_SUMMARY_ID = "error-summary";
const ERROR_SUMMARY_TITLE = "error-summary-title";

const SUBMIT_ERROR_ID = "submit-error-message";
const SUBMIT_SUCCESS_ID = "submit-success-message";

const BUTTON_TEXT = {
  initial: submitButton.innerText,
  submitting: "Submitting...",
};

const FIELD_ERRORS = {
  name: "Enter your name",
  email: "Enter a valid email",
  message: "Enter a message",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const errorIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.9 473.9" focusable="false">
    <circle cx="237" cy="237" r="237" fill="currentcolor"/>
    <path fill="#fff" d="m214.4 252.4-6.7-100.2a740.5 740.5 0 0 1-1.9-42c0-11.6 3-20.6 9.1-27 6-6.6 14-9.8 24-9.8 12 0 20 4.1 24 12.4s6 20.3 6 35.9c0 9.2-.4 18.6-1.4 28l-9 103.1c-1 12.3-3 21.7-6.3 28.2a16.4 16.4 0 0 1-15.8 9.9c-7.6 0-12.8-3.2-15.7-9.6-3-6.3-5-16-6.3-29zM237.6 390c-8.5 0-16-2.8-22.3-8.3a29 29 0 0 1-9.5-23c0-8.7 3-16 9.1-22.1 6-6.1 13.5-9.1 22.3-9.1a31 31 0 0 1 22.5 9c6.2 6.1 9.3 13.5 9.3 22.1 0 9.8-3.2 17.4-9.4 23a32 32 0 0 1-22 8.4z"/>
  </svg>
`;

const addErrorSummary = (invalidFields: Element[]) => {
  const listItems = invalidFields.map(
    ({ id }) => `<li><a href="#${id}">${FIELD_ERRORS[id]}</a></li>`
  );

  form.insertAdjacentHTML(
    "afterbegin",
    `
    <div
     class="c-form__alert c-form__alert--error"
     id="${ERROR_SUMMARY_ID}"
     aria-labelledby="${ERROR_SUMMARY_TITLE}"
     role="alert"
     tabindex="-1"
    >
      <h3 id="${ERROR_SUMMARY_TITLE}">Please correct the following:</h3>
      <ul>${listItems.join("")}</ul>
    </div>
    `
  );

  // Focus the newly inserted error summary element
  document.getElementById(ERROR_SUMMARY_ID).focus();
};

const setInlineErrorMessage = (invalidField: Element) => {
  const ERROR_ID = `${invalidField.id}-error`;

  invalidField.setAttribute("aria-describedby", ERROR_ID);
  invalidField.insertAdjacentHTML(
    "afterend",
    `<p class="c-form__error" id="${ERROR_ID}" data-inline-error="true">
      ${errorIcon}
      <span class="u-a11y-only">Error:</span> ${FIELD_ERRORS[invalidField.id]}
    </p>`
  );
};

const removeErrors = () => {
  const inlineErrors = [...document.querySelectorAll("[data-inline-error]")];
  const errorSummary = document.getElementById(ERROR_SUMMARY_ID);

  errorSummary?.remove();
  inlineErrors.forEach((error) => {
    const correspondingField = form.querySelector(
      `[aria-describedby="${error.id}"]`
    );

    error.remove();
    correspondingField.removeAttribute("aria-describedby");
  });
};

const disableSubmitButton = () => {
  submitButton.disabled = true;
};

const enableSubmitButton = () => {
  submitButton.disabled = false;
};

const addLoadingIndicator = () => {
  submitButton.innerText = BUTTON_TEXT.submitting;
};

const removeLoadingIndicator = () => {
  submitButton.innerText = BUTTON_TEXT.initial;
};

const handleSubmitSuccess = async () => {
  submitButton.insertAdjacentHTML(
    "beforebegin",
    `<p class="c-form__alert c-form__alert--success" id="${SUBMIT_SUCCESS_ID}" role="alert">
      Your message was sent successfully.
    </p>`
  );

  await sleep(2000);

  submitButton.previousElementSibling.remove();
  form.reset();

  // Renable the form once the old contents have been cleared
  enableSubmitButton();
};

const handleSubmitError = (error: Error) => {
  submitButton.insertAdjacentHTML(
    "beforebegin",
    `<p class="c-form__alert c-form__alert--error" id="${SUBMIT_ERROR_ID}" role="alert">
      The form could not be submitted: ${error.message}.
    </p>`
  );

  enableSubmitButton();
  console.error(error);
};

const getInvalidFields = (): Element[] => {
  const textarea = form.querySelector("textarea");
  const invalidFields = [...form.querySelectorAll(":invalid")];

  // Check if the `textarea` is empty
  if (!invalidFields.includes(textarea) && textarea.value.trim() === "") {
    return [...invalidFields, textarea];
  }

  return invalidFields;
};

const validate = () => {
  // Clear any previous errors
  removeErrors();

  // Remove previous submit success/error messages
  document.getElementById(SUBMIT_ERROR_ID)?.remove();
  document.getElementById(SUBMIT_SUCCESS_ID)?.remove();

  const invalidFields = getInvalidFields();

  if (invalidFields.length > 0) {
    addErrorSummary(invalidFields);
    invalidFields.forEach(setInlineErrorMessage);
    return false;
  }

  return true;
};

const submitData = async () => {
  // Disable the button to prevent multiple submissions
  disableSubmitButton();

  const timerId = setTimeout(addLoadingIndicator, 200);

  try {
    const formData = new FormData(form) as unknown;
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as Record<string, string>).toString(),
    });

    if (!res.ok) {
      // Force execution into the `catch` block
      throw Error(`${res.status} ${res.statusText}`);
    }

    handleSubmitSuccess();
  } catch (error) {
    handleSubmitError(error);
  } finally {
    clearTimeout(timerId);
    removeLoadingIndicator();
  }
};

const onSubmit = async (event: Event) => {
  event.preventDefault();
  const isValid = validate();

  if (isValid) {
    await submitData();
  }
};

export default (): void => {
  if (!form || !submitButton) return;
  form.noValidate = true;
  form.addEventListener("submit", onSubmit);
};
