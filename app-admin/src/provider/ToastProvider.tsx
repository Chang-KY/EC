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
      toastClassName="!rounded-md !p-3 !bg-gray-900/95 !text-gray-100 !shadow-lg !border !border-gray-800 !text-sm !leading-5"
      theme="dark"
    />
  )
}

export default ToastProvider
