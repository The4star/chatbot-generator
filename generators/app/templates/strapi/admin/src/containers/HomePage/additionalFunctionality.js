import { request } from 'strapi-helper-plugin';

const handleClick = async (setNotification) => {
  try {
    const response = await request('/df/sync', { method: 'GET' });
    if (response.error) {
      setNotification({
        type: 'bad',
        message: response.error
      })
    } else {
      setNotification({
        type: "good",
        message: response.message
      })
    }
  } catch (error) {
    setNotification({
      type: 'bad',
      message: error.message
    })
  }
  setTimeout(() => {
    setNotification(null)
  }, 4000);
}

export {
  handleClick
}