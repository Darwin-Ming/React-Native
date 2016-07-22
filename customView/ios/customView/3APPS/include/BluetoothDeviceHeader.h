//
//  BluetoothDeviceHeader.h
//  GSDK
//
//  Created by kai.shang on 15/4/28.
//  Copyright (c) 2015年 kai.shang. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SerialGATT.h"


@interface JB_BluetoothDevice : NSObject
@property(nonatomic, strong) SerialGATT *mSensor;
@property(nonatomic, strong) CBPeripheral *mPeripheral;
@end

@implementation JB_BluetoothDevice

@end
