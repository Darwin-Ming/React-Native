//
//  ConnetionWithBlueTooth.m
//  BluetoothDemo
//
//  Created by darwin on 16/7/15.
//  Copyright © 2016年 darwin. All rights reserved.
//

#import "ConnetionWithBlueTooth.h"

#import "3APPS/include/EscCommand.h"

#import <CoreBluetooth/CoreBluetooth.h>

#import "RCTBridgeModule.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

#import <dispatch/dispatch.h>

@interface ConnetionWithBlueTooth () <CBPeripheralDelegate, CBCentralManagerDelegate, RCTBridgeModule>

@property (nonatomic, strong) CBCentralManager *centeralManager;
@property (nonatomic, copy) NSMutableArray *periphralArray;
@property (nonatomic, strong) CBPeripheral *connectedPeripheral;
@property (nonatomic, strong) CBService *connectedService;

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

RCT_EXPORT_METHOD(connectPeripheral:(NSString *)UUIDString)
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

#pragma mark - 扫描服务 －

RCT_EXPORT_METHOD(discoverService) {
  [_connectedPeripheral discoverServices:nil];
}

#pragma mark  - 扫描特征值 -

RCT_EXPORT_METHOD(didDiscoverCharacteristicsForService:(NSString *)serviceUUIDString) {
  CBUUID *serviceUUID = [CBUUID UUIDWithString:serviceUUIDString];
  for (CBService *ser in _connectedPeripheral.services) {
    if ([ser.UUID.UUIDString isEqualToString:serviceUUIDString]) {
      _connectedService = ser;
      break;
    }
  }
  [_connectedPeripheral discoverCharacteristics:nil forService:_connectedService];
}

#pragma mark - 传输数据给特征值 - 

RCT_EXPORT_METHOD(writeValueForDescriptor:(NSString *)characteristicUUIDString Data:(NSString *)wirteString) {
  
  CBUUID *characteristicUUID = [CBUUID UUIDWithString:characteristicUUIDString];
  CBCharacteristic *wirteCharacteristic;
  for (CBCharacteristic *characteristic in _connectedService.characteristics) {
    if ([characteristic.UUID isEqual:characteristicUUID]) {
      wirteCharacteristic = characteristic;
    }
  }
  

  
  EscCommand *escCommand = [[EscCommand alloc] init];
  [escCommand addInitializePrinter];
//  [escCommand addSetReverseMode:1];
  [escCommand addSetJustification:1];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addText:@"ESC Print Hello \r\n"];
   [escCommand addText:@"\r\n"];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addSetJustification:0];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addSetJustification:2];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addText:@"ESC Print Hello \r\n"];
  [escCommand addPrintMode:0X1B];
  [escCommand addPrintAndFeedLines:8];
  [escCommand addCutPaper:1];
  
  
  
  //  NSData *wirteData = [wirteString dataUsingEncoding:NSUTF8StringEncoding];
  
  
  [_connectedPeripheral writeValue:[escCommand getCommand] forCharacteristic:wirteCharacteristic type:CBCharacteristicWriteWithoutResponse];
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
  } else if (!([_periphralArray containsObject:peripheral])) {
    [_periphralArray addObject:peripheral];
    [self sendDiscoverPeripheralEventWithPeripheral:peripheral RSSI:RSSI];
  }
}

- (void)sendDiscoverPeripheralEventWithPeripheral:(CBPeripheral *)peripheral RSSI:(NSNumber *)RSSI {
  
  NSMutableDictionary *peripheralInfoDic = [[NSMutableDictionary alloc] init];
  [peripheralInfoDic setObject:(peripheral.name ? peripheral.name : @"Unknow") forKey:@"peripheralName"];
  [peripheralInfoDic setObject:RSSI forKey:@"peripheralRSSI"];
  [peripheralInfoDic setObject:peripheral.identifier.UUIDString forKey:@"peripheralID"];
  [peripheralInfoDic setObject:@(peripheral.state) forKey:@"peripheralStateCode"];
//  CBPeripheralStateDisconnected = 0,
//  CBPeripheralStateConnecting = 1,
//  CBPeripheralStateConnected = 2,
//  CBPeripheralStateDisconnecting(NS_AVAILABLE(NA, 9_0)) = 3
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"didDiscoverPeripheral" body:peripheralInfoDic];
}

- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {
     NSLog(@"%s", __func__);
  [self.bridge.eventDispatcher sendAppEventWithName:@"didConnectPeripheral" body:@{@"peripheralUUID": peripheral.identifier.UUIDString, @"peripheralName": (peripheral.name ? peripheral.name : @"Unknown")}];
  _connectedPeripheral = peripheral;
  _connectedPeripheral.delegate = self;
}

- (void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
//    [self.bridge.eventDispatcher sendAppEventWithName:@"didFailToConnectPeripheral" body:@{@"name": @(__func__)}];
}

- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error {
//    [self.bridge.eventDispatcher sendAppEventWithName:@"didDisconnectPeripheral" body:@{@"name": @(__func__)}];
}

#pragma mark - 周边设备代理方法 －

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(nullable NSError *)error {
  NSMutableArray *arr = [NSMutableArray new];
  for (CBService *service in _connectedPeripheral.services) {
    NSMutableDictionary *serviceDic = [NSMutableDictionary new];
    [serviceDic setObject:service.UUID.UUIDString forKey:@"serviceUUID"];
    [serviceDic setObject:(service.characteristics ? service.characteristics : [NSArray new]) forKey:@"serviceCharacteristics"];
    [arr addObject:serviceDic];
  }
  NSLog(@"%s", __func__);
  [self.bridge.eventDispatcher sendAppEventWithName:@"didDiscoverServices" body:arr];
}

- (void)peripheral:(CBPeripheral *)peripheral didReadRSSI:(NSNumber *)RSSI error:(nullable NSError *)error {
  
}

- (void)peripheralDidUpdateRSSI:(CBPeripheral *)peripheral error:(nullable NSError *)error {
  
}

- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(nullable NSError *)error {
//  _connectedService = service;
  NSMutableArray *characteristicArr = [NSMutableArray new];
  for (CBCharacteristic *characteristic in service.characteristics) {
    NSMutableDictionary *characteristicDic = [NSMutableDictionary new];
    [characteristicDic setObject:characteristic.UUID.UUIDString forKey:@"characteristicUUID"];
    [characteristicDic setObject:(characteristic.descriptors[0].value ? characteristic.descriptors[0].value : [NSString string])  forKey:@"characteristicDescriptors"];
    [characteristicDic setObject:@(characteristic.properties) forKey:@"characteristicProperties"];
    [characteristicArr addObject:characteristicDic];
  }
  [self.bridge.eventDispatcher sendAppEventWithName:@"didDiscoverCharacteristics" body:characteristicArr];
}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(nullable NSError *)error {

}

- (void)peripheral:(CBPeripheral *)peripheral didWriteValueForDescriptor:(CBDescriptor *)descriptor error:(nullable NSError *)error {

}

@end