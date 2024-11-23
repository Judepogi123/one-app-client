import React, { ComponentProps, forwardRef } from 'react';
import {QRCodeCanvas} from 'qrcode.react';

type QRprops = ComponentProps<typeof QRCodeCanvas>

interface QRCodeProps extends QRprops{}

const QRCode = forwardRef<React.ElementRef<typeof QRCodeCanvas>,QRCodeProps>(
    (props, ref)=>{
        return <QRCodeCanvas {...props} ref={ref} />
    }
)

export default QRCode;