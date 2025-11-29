import React from 'react'
import { Slide, ToastContainer } from 'react-toastify'

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      transition={Slide}
      toastClassName="!rounded-none"
      theme="dark"
    />
  )
}

export default ToastProvider
