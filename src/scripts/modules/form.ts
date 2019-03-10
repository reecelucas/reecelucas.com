const form = document.querySelector('form');
const btn = document.querySelector('[data-form-submit]') as HTMLButtonElement;
const config = {
  btnText: (btn && btn.innerText) || 'send',
  errorAttribute: 'aria-invalid',
  errorClass: 'has-error',
  formEndpoint: 'https://usebasin.com/f/74b4e1029fb9.json'
};
let timerId;

// Helpers
const isFormInput = (target: HTMLFormElement): boolean => {
  const { nodeName } = target;

  return (
    target &&
    (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT')
  );
};

const hasError = (field: HTMLFormElement): boolean => {
  const { nextElementSibling } = field;
  const hasErrorAttribute = field.hasAttribute(config.errorAttribute);
  const hasErrorMessage =
    nextElementSibling &&
    nextElementSibling.classList &&
    nextElementSibling.classList.contains(config.errorClass);

  return hasErrorAttribute && hasErrorMessage;
};

const setError = (field: HTMLFormElement) => {
  if (hasError(field)) {
    return;
  }

  field.setAttribute(config.errorAttribute, 'true');
  field.insertAdjacentHTML(
    'afterend',
    `<span class=${config.errorClass} role="alert" aria-live="assertive">
      ${field.validationMessage}
    </span>`
  );
};

const removeError = (field: HTMLFormElement) => {
  if (!hasError(field)) {
    return;
  }

  field.removeAttribute(config.errorAttribute);
  field.nextElementSibling.remove();
};

const addLoadingIndicator = () => {
  btn.innerText = 'Submitting...';
  btn.disabled = true;
};

const removeLoadingIndicator = () => {
  btn.innerText = config.btnText;
  btn.disabled = false;
};

const handleSubmitError = (error: Error) => {
  // TODO: show user-friendly error message here...
  console.error(error);
};

const handleSubmitSuccess = (response: Response) => {
  if (!response.ok) {
    throw new Error('Response was not ok.');
  }

  // TODO: set success message & remove user-friendly error message here...
  form.reset();
};

const handleSubmit = () => {
  const formData = new FormData(form);
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  };

  timerId = setTimeout(addLoadingIndicator, 250);

  fetch(config.formEndpoint, requestOptions)
    .then(handleSubmitSuccess)
    .catch(handleSubmitError)
    .finally(() => {
      clearTimeout(timerId);
      removeLoadingIndicator();
    });
};

// Event handlers
const onBlur = (field: HTMLFormElement) => {
  removeError(field);
  field.checkValidity();
};

const onInvalid = (field: HTMLFormElement) => {
  setError(field);
};

const onSubmit = (event: Event) => {
  event.preventDefault();
  const { target } = event;

  if (!target || !(target instanceof HTMLFormElement)) {
    return;
  }

  if (target.checkValidity()) {
    handleSubmit();
    return;
  }

  // The form contains errors, so we assign focus to the first invalid field
  const firstInvalidField = form.querySelector(`[${config.errorAttribute}]`);
  if (firstInvalidField instanceof HTMLElement) {
    firstInvalidField.focus();
  }
};

export default () => {
  if (!form) {
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
