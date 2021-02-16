import {
  sleep,
  isFormInput,
  insertMessage,
  removeElement,
  getFormData
} from './helpers';

const form = document.querySelector('form');
const submitButton = document.querySelector('[data-form-submit]') as HTMLButtonElement; // prettier-ignore
const config = {
  btnText: (submitButton && submitButton.innerText) || 'send',
  errorAttribute: 'aria-invalid',
  errorClass: 'form-message--error',
  successClass: 'form-message--success u-spaced-small'
};

const hasError = (field: HTMLFormElement): boolean => {
  const { nextElementSibling } = field;
  const hasErrorAttr = field.hasAttribute(config.errorAttribute);
  const hasErrorMsg =
    nextElementSibling &&
    nextElementSibling.classList.contains(config.errorClass);

  return hasErrorAttr && hasErrorMsg;
};

const addFieldError = (field: HTMLFormElement): void => {
  if (hasError(field)) {
    return;
  }

  field.setAttribute(config.errorAttribute, 'true');
  insertMessage({
    element: field,
    classList: config.errorClass,
    message: field.validationMessage
  });
};

const removeFieldError = (field: HTMLFormElement): void => {
  if (!hasError(field)) {
    return;
  }

  field.removeAttribute(config.errorAttribute);
  removeElement(field.nextElementSibling);
};

const addLoadingIndicator = (): void => {
  submitButton.innerText = 'Submitting...';
  submitButton.disabled = true;
};

const removeLoadingIndicator = (): void => {
  submitButton.innerText = config.btnText;
  submitButton.disabled = false;
};

const handleSubmitError = (error: Error): void => {
  insertMessage({
    element: submitButton,
    classList: `${config.errorClass} u-spaced-small`,
    message: error.message,
    position: 'beforebegin'
  });

  console.error(error);
};

const handleSubmitSuccess = async (response: Response): Promise<void> => {
  if (!response.ok) {
    throw new Error('Response was not ok.');
  }

  insertMessage({
    element: submitButton,
    classList: config.successClass,
    message: 'Your message was sent successfully.',
    position: 'beforebegin'
  });

  await sleep(2000);

  removeElement(submitButton.previousElementSibling);
  form.reset();
};

const handleSubmit = async (): Promise<void> => {
  const timerId = setTimeout(addLoadingIndicator, 250);

  try {
    const response = await fetch(process.env.CONTACT_FORM_URL, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      mode: 'cors',
      body: getFormData(form)
    });

    await handleSubmitSuccess(response);
  } catch (error) {
    handleSubmitError(error);
  } finally {
    clearTimeout(timerId);
    removeLoadingIndicator();
  }
};

// Event handlers
const onBlur = (field: HTMLFormElement): void => {
  removeFieldError(field);
  field.checkValidity();
};

const onInvalid = (field: HTMLFormElement): void => {
  addFieldError(field);
};

const onSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();
  const { target } = event;

  if (!target || !(target instanceof HTMLFormElement)) {
    return;
  }

  if (target.checkValidity()) {
    await handleSubmit();
    return;
  }

  // The form contains errors, so we assign focus to the first invalid field
  const firstInvalidField = form.querySelector(`[${config.errorAttribute}]`);
  if (firstInvalidField instanceof HTMLElement) {
    firstInvalidField.focus();
  }
};

export default (): void => {
  if (!form || !submitButton) {
    return;
  }

  form.noValidate = true;

  form.addEventListener(
    'blur',
    ({ target }) => {
      const element = target as HTMLFormElement;

      if (isFormInput(element)) {
        onBlur(element);
      }
    },
    true
  );

  form.addEventListener(
    'invalid',
    ({ target }) => {
      const element = target as HTMLFormElement;

      if (isFormInput(element)) {
        onInvalid(element);
      }
    },
    true
  );

  form.addEventListener('submit', onSubmit);
};
