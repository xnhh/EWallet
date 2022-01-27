import React from 'react';
import { SnackbarProvider } from 'notistack';
import SimpleSnackbarProvider from '../SimpleSnackbar'
import { isMobile } from 'react-device-detect'

/**
* 显示的消息条的最大数量，如果超过，会关掉最先打开的然后再显示新的，是一个队列
* 如果只想显示1个，设置为1，3是默认值
*/
const MAX_SNACKBAR = 3
//设置自动隐藏时间，默认值是5秒，也就是5000毫秒
const AUTO_HIDE_DURATION = 3000
//设置消息条位置，默认值为底部左边
const POSITION = {
    vertical: 'bottom',
    horizontal: 'left'
}

export default function NotistackWrapper({children}) {
  return (
    <SnackbarProvider
      maxSnack={MAX_SNACKBAR}
      autoHideDuration={AUTO_HIDE_DURATION}
      anchorOrigin={POSITION}
      dense={isMobile}
    >
      <SimpleSnackbarProvider>
        {children}
      </SimpleSnackbarProvider>
    </SnackbarProvider>
  )
}

