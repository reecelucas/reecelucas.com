interface InsertMessageParams {
  element: Element;
  message: string;
  classList: string;
  position?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
}

export const isFormInput = (target: HTMLElement): boolean => {
  const { nodeName } = target;

  return (
    target &&
    (nodeName === 'INPUT' || nodeName === 'TEXTAREA' || nodeName === 'SELECT')
  );
};

export const insertMessage = ({
  element,
  message,
  classList,
  position = 'afterend'
}: InsertMessageParams) => {
  element.insertAdjacentHTML(
    position,
    `<span class="form-message ${classList}" role="alert" aria-live="assertive">
      ${message}
    </span>`
  );
};

export const removeElement = elem => {
  elem.remove();
};

export const getFormData = (form: HTMLFormElement) => {
  const formData = Array.from(new FormData(form));

  return JSON.stringify(
    formData.reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value
      }),
      {}
    )
  );
};
