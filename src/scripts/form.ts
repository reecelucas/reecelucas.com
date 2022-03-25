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

export default () => {
  if (!form || !submitButton) return;
  form.noValidate = true;
  form.addEventListener("submit", onSubmit);
};
