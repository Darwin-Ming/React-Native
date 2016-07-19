//
//  ConnetionWithBlueTooth.m
//  BluetoothDemo
//
//  Created by darwin on 16/7/15.
//  Copyright © 2016年 darwin. All rights reserved.
//

#import "ConnetionWithBlueTooth.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

#import <dispatch/dispatch.h>

@interface ConnetionWithBlueTooth () <CBPeripheralDelegate, CBCentralManagerDelegate, RCTBridgeModule>

@property (nonatomic, strong) CBCentralManager *centeralManager;
@property (nonatomic, copy) NSMutableArray *periphralArray;
@property (nonatomic, strong) CBPeripheral *connectedPeripheral;

@end

@implementation ConnetionWithBlueTooth

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (instancetype)init {
    return self;
}


RCT_EXPORT_METHOD(creatCenteralManager) {
    if (!_centeralManager) {
      _centeralManager = [[CBCentralManager alloc] initWithDelegate:self queue:dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)];
       NSLog(@"%s", __func__);
    }

}

RCT_EXPORT_METHOD(isPoweredOn:(RCTResponseSenderBlock)callback) {
  callback(@[@(self.centeralManager.state == CBCentralManagerStatePoweredOn)]);
}

RCT_EXPORT_METHOD(isSupportedBuleTooth:(RCTResponseSenderBlock)callback) {
    callback(@[@(self.centeralManager.state != CBCentralManagerStateUnsupported)]);
}

RCT_EXPORT_METHOD(isUnauthorized:(RCTResponseSenderBlock)callback) {
  callback(@[@(self.centeralManager.state != CBCentralManagerStateUnauthorized)]);
}

RCT_EXPORT_METHOD(searchlinkDevice) {
    // 开启的话开始扫描蓝牙设备
  [self.centeralManager scanForPeripheralsWithServices:nil options:nil];
//  double delayInSeconds = 20.0;
//   // 扫描20s后未扫描到设备停止扫描
//  dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
//  dispatch_after(popTime, dispatch_get_main_queue(), ^(void) {
//      [self stopScan];
//  });
}

#pragma mark - 连接设备 -

RCT_EXPORT_METHOD(connectDiscoverPeripheral:(NSString *)UUIDString)
{
    NSUUID *UUID = [[NSUUID alloc] initWithUUIDString:UUIDString];
    CBPeripheral *peripheralDevice;
    for (CBPeripheral *per in _periphralArray) {
        if ([per.identifier isEqual:UUID]) {
            peripheralDevice = per;
            break;
          }
      }
    [self.centeralManager connectPeripheral:peripheralDevice options:nil];
    self.connectedPeripheral = peripheralDevice;
}

#pragma mark - 断开连接 -

RCT_EXPORT_METHOD(cancelConnectPeripheral)
{
    [self.centeralManager cancelPeripheralConnection:_connectedPeripheral];
}

#pragma mark - 停止扫描 -

RCT_EXPORT_METHOD(stopScanPeripheral)
{
    [self.centeralManager stopScan];
}

#pragma mark - 中心设备的代理方法 －

- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    [self.bridge.eventDispatcher sendAppEventWithName:@"centralManagerStateChange" body:@{@"powerState": @(self.centeralManager.state == CBCentralManagerStatePoweredOn)}];
}

- (void)centralManager:(CBCentralManager *)central willRestoreState:(NSDictionary<NSString *,id> *)dict {
    NSLog(@"%s", __func__);
}

- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(nonnull CBPeripheral *)peripheral advertisementData:(nonnull NSDictionary<NSString *,id> *)advertisementData RSSI:(nonnull NSNumber *)RSSI {
  if (!_periphralArray) {
    _periphralArray = [[NSMutableArray alloc] init];
    [_periphralArray addObject:peripheral];
    [self sendDiscoverPeripheralEventWithPeripheral:peripheral RSSI:RSSI];
  } else if (_periphralArray.count < 2) {
    [_periphralArray addObject:peripheral];
    [self sendDiscoverPeripheralEventWithPeripheral:peripheral RSSI:RSSI];
  } else if (([_periphralArray indexOfObject:peripheral] + 1)){
//    _periphralArray has
    NSLog(@"%lu", [_periphralArray indexOfObject:peripheral] + 1);
    [_periphralArray addObject:peripheral];
    [self sendDiscoverPeripheralEventWithPeripheral:peripheral RSSI:RSSI];
  }
  NSLog(@"%@", peripheral.identifier.UUIDString);
}

- (void)sendDiscoverPeripheralEventWithPeripheral:(CBPeripheral *)peripheral RSSI:(NSNumber *)RSSI {
  
  NSMutableDictionary *peripheralInfoDic = [[NSMutableDictionary alloc] init];
  [peripheralInfoDic setObject:(peripheral.name ? peripheral.name : @"Unknow") forKey:@"peripheralName"];
  [peripheralInfoDic setObject:RSSI forKey:@"peripheralRSSI"];
  [peripheralInfoDic setObject:peripheral.identifier.UUIDString forKey:@"peripheralID"];
  
//  CBPeripheralStateDisconnected = 0,
//  CBPeripheralStateConnecting = 1,
//  CBPeripheralStateConnected = 2,
//  CBPeripheralStateDisconnecting(NS_AVAILABLE(NA, 9_0)) = 3
  [peripheralInfoDic setObject:@(peripheral.state) forKey:@"peripheralStateCode"];
  
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"discoverPeripheral" body:peripheralInfoDic];
}

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {
     NSLog(@"%s", __func__);
//    [self.bridge.eventDispatcher sendAppEventWithName:@"didConnectPeripheral" body:@{@"name": @(__func__)}];
}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
//    [self.bridge.eventDispatcher sendAppEventWithName:@"didFailToConnectPeripheral" body:@{@"name": @(__func__)}];
}

- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
//    [self.bridge.eventDispatcher sendAppEventWithName:@"didDisconnectPeripheral" body:@{@"name": @(__func__)}];
}

#pragma mark - 周边设备代理方法 －

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(nullable NSError *)error {
  
}

- (void)peripheral:(CBPeripheral *)peripheral didReadRSSI:(NSNumber *)RSSI error:(nullable NSError *)error {
  
}

- (void)peripheralDidUpdateRSSI:(CBPeripheral *)peripheral error:(nullable NSError *)error {
  
}

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(nullable NSError *)error {

}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(nullable NSError *)error {

}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForDescriptor:(CBDescriptor *)descriptor error:(nullable NSError *)error {

}

@end