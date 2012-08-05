//
//  MixiWidgetPlugin.m
//
//  $Revision: 13M $
//  $Date: 2007-03-29 10:48:52 +0900 (Thu, 29 Mar 2007) $
//

#import "MixiWidgetPlugin.h"
#import <CoreFoundation/CoreFoundation.h>
#import <Security/Security.h>
#import <CoreServices/CoreServices.h>


const unichar NECSpecialCharactors[] = {
	0x0000, 0x2460, 0x2461, 0x2462, 0x2463, 0x2464, 0x2465, 0x2466, // A0-A7
	0x2467, 0x2468, 0x2469, 0x246A, 0x246B, 0x246C, 0x246D, 0x246E, // A8-AF
	0x246F, 0x2470, 0x2471, 0x2472, 0x2473, 0x2160, 0x2161, 0x2162, // B0-B7
	0x2163, 0x2164, 0x2165, 0x2166, 0x2167, 0x2168, 0x2169, 0x0000, // B8-BF
	0x3349, 0x3314, 0x3322, 0x334D, 0x3318, 0x3327, 0x3303, 0x3336, // C0-C7
	0x3351, 0x3357, 0x330D, 0x3326, 0x3323, 0x332B, 0x334A, 0x333B, // C8-CF
	0x339C, 0x339D, 0x339E, 0x338E, 0x338F, 0x33C4, 0x33A1, 0x0000, // D0-D7
	0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x337B, // D8-DF
	0x301D, 0x301F, 0x2116, 0x33CD, 0x2121, 0x32A4, 0x32A5, 0x32A6, // E0-E7
	0x32A7, 0x32A8, 0x3231, 0x3232, 0x3239, 0x337E, 0x337D, 0x337C, // E8-EF
	0x2252, 0x2261, 0x222B, 0x222E, 0x2211, 0x221A, 0x22A5, 0x2220, // F0-F7
	0x221F, 0x22BF, 0x2235, 0x2229, 0x222A, 0x0000, 0x0000, 0x0000  // F8-FF
};


const unichar IBMSpecialCharactors[] = {
	0x0000, 0x7E8A, 0x891C, 0x9348, 0x9288, 0x84DC, 0x4FC9, 0x70BB, // F9A0-F9A7
	0x6631, 0x68C8, 0x92F9, 0x66FB, 0x5F45, 0x4E28, 0x4EE1, 0x4EFC, // F9A8-F9AF
	0x4F00, 0x4F03, 0x4F39, 0x4F56, 0x4F92, 0x4F8A, 0x4F9A, 0x4F94, // F9B0-F9B7
	0x4FCD, 0x5040, 0x5022, 0x4FFF, 0x501E, 0x5046, 0x5070, 0x5042, // F9B8-F9BF
	0x5094, 0x50F4, 0x50D8, 0x514A, 0x5164, 0x519D, 0x51BE, 0x51EC, // F9C0-F9C7
	0x5215, 0x529C, 0x52A6, 0x52C0, 0x52DB, 0x5300, 0x5307, 0x5324, // F9C8-F9CF
	0x5372, 0x5393, 0x53B2, 0x53DD, 0xFA0E, 0x549C, 0x548A, 0x54A9, // F9D0-F9D7
	0x54FF, 0x5586, 0x5759, 0x5765, 0x57AC, 0x57C8, 0x57C7, 0xFA0F, // F9D8-F9DF
	0xFA10, 0x589E, 0x58B2, 0x590B, 0x5953, 0x595B, 0x595D, 0x5963, // F9E0-F9E7
	0x59A4, 0x59BA, 0x5B56, 0x5BC0, 0x752F, 0x5BD8, 0x5BEC, 0x5C1E, // F9E8-F9EF
	0x5CA6, 0x5CBA, 0x5CF5, 0x5D27, 0x5D53, 0xFA11, 0x5D42, 0x5D6D, // F9F0-F9F7
	0x5DB8, 0x5DB9, 0x5DD0, 0x5F21, 0x5F34, 0x5F67, 0x5FB7, 0x0000, // F9F8-F9FF
	0x0000, 0x5FDE, 0x605D, 0x6085, 0x608A, 0x60DE, 0x60D5, 0x6120, // FAA0-FAA7
	0x60F2, 0x6111, 0x6137, 0x6130, 0x6198, 0x6213, 0x62A6, 0x63F5, // FAA8-FAAF
	0x6460, 0x649D, 0x64CE, 0x654E, 0x6600, 0x6615, 0x663B, 0x6609, // FAB0-FAB7
	0x662E, 0x661E, 0x6624, 0x6665, 0x6657, 0x6659, 0xFA12, 0x6673, // FAB8-FABF
	0x6699, 0x66A0, 0x66B2, 0x66BF, 0x66FA, 0x670E, 0xF929, 0x6766, // FAC0-FAC7
	0x67BB, 0x6852, 0x67C0, 0x6801, 0x6844, 0x68CF, 0xFA13, 0x6968, // FAC8-FACF
	0xFA14, 0x6998, 0x69E2, 0x6A30, 0x6A6B, 0x6A46, 0x6A73, 0x6A7E, // FAD0-FAD7
	0x6AE2, 0x6AE4, 0x6BD6, 0x6C3F, 0x6C5C, 0x6C86, 0x6C6F, 0x6CDA, // FAD8-FADF
	0x6D04, 0x6D87, 0x6D6F, 0x6D96, 0x6DAC, 0x6DCF, 0x6DF8, 0x6DF2, // FAE0-FAE7
	0x6DFC, 0x6E39, 0x6E5C, 0x6E27, 0x6E3C, 0x6EBF, 0x6F88, 0x6FB5, // FAE8-FAEF
	0x6FF5, 0x7005, 0x7007, 0x7028, 0x7085, 0x70AB, 0x710F, 0x7104, // FAF0-FAF7
	0x715C, 0x7146, 0x7147, 0xFA15, 0x71C1, 0x71FE, 0x72B1, 0x0000, // FAF8-FAFF
	0x0000, 0x72BE, 0x7324, 0xFA16, 0x7377, 0x73BD, 0x73C9, 0x73D6, // FBA0-FBA7
	0x73E3, 0x73D2, 0x7407, 0x73F5, 0x7426, 0x742A, 0x7429, 0x742E, // FBA8-FBAF
	0x7462, 0x7489, 0x749F, 0x7501, 0x756F, 0x7682, 0x769C, 0x769E, // FBB0-FBB7
	0x769B, 0x76A6, 0xFA17, 0x7746, 0x52AF, 0x7821, 0x784E, 0x7864, // FBB8-FBBF
	0x787A, 0x7930, 0xFA18, 0xFA19, 0xFA1A, 0x7994, 0xFA1B, 0x799B, // FBC0-FBC7
	0x7AD1, 0x7AE7, 0xFA1C, 0x7AEB, 0x7B9E, 0xFA1D, 0x7D48, 0x7D5C, // FBC8-FBCF
	0x7DB7, 0x7DA0, 0x7DD6, 0x7E52, 0x7F47, 0x7FA1, 0xFA1E, 0x8301, // FBD0-FBD7
	0x8362, 0x837F, 0x83C7, 0x83F6, 0x8448, 0x84B4, 0x8553, 0x8559, // FBD8-FBDF
	0x856B, 0xFA1F, 0x85B0, 0xFA20, 0xFA21, 0x8807, 0x88F5, 0x8A12, // FBE0-FBE7
	0x8A37, 0x8A79, 0x8AA7, 0x8ABE, 0x8ADF, 0xFA22, 0x8AF6, 0x8B53, // FBE8-FBEF
	0x8B7F, 0x8CF0, 0x8CF4, 0x8D12, 0x8D76, 0xFA23, 0x8ECF, 0xFA24, // FBF0-FBF7
	0xFA25, 0x9067, 0x90DE, 0xFA26, 0x9115, 0x9127, 0x91DA, 0x0000, // FBF8-FBFF
	0x0000, 0x91D7, 0x91DE, 0x91ED, 0x91EE, 0x91E4, 0x91E5, 0x9206, // FCA0-FCA7
	0x9210, 0x920A, 0x923A, 0x9240, 0x923C, 0x924E, 0x9259, 0x9251, // FCA8-FCAF
	0x9239, 0x9267, 0x92A7, 0x9277, 0x9278, 0x92E7, 0x92D7, 0x92D9, // FCB0-FCB7
	0x92D0, 0xFA27, 0x92D5, 0x92E0, 0x92D3, 0x9325, 0x9321, 0x92FB, // FCB8-FCBF
	0xFA28, 0x931E, 0x92FF, 0x931D, 0x9302, 0x9370, 0x9357, 0x93A4, // FCC0-FCC7
	0x93C6, 0x93DE, 0x93F8, 0x9431, 0x9445, 0x9448, 0x9592, 0xF9DC, // FCC8-FCCF
	0xFA29, 0x969D, 0x96AF, 0x9733, 0x973B, 0x9743, 0x974D, 0x974F, // FCD0-FCD7
	0x9751, 0x9755, 0x9857, 0x9865, 0xFA2A, 0xFA2B, 0x9927, 0xFA2C, // FCD8-FCDF
	0x999E, 0x9A4E, 0x9AD9, 0x9ADC, 0x9B75, 0x9B72, 0x9B8F, 0x9BB1, // FCE0-FCE7
	0x9BBB, 0x9C00, 0x9D70, 0x9D6B, 0xFA2D, 0x9E19, 0x9ED1, 0x0000, // FCE8-FCEF
	0x0000, 0x2170, 0x2171, 0x2172, 0x2173, 0x2174, 0x2175, 0x2176, // FCF0-FCF7
	0x2177, 0x2178, 0x2179, 0xFFE2, 0xFFE4, 0xFF07, 0xFF02, 0x0000  // FCF8-FCFF
};



@implementation MixiWidgetPlugin


//-- initWithWebView
// 初期化メソッド
-(id) initWithWebView:(WebView*) webView
{
	self = [super init];
	return self;
}


//-- windowScriptObjectAvailable
// インスタンスの登録
-(void) windowScriptObjectAvailable:(WebScriptObject*) webScriptObject
{
	_webScriptObject = [webScriptObject retain];
	[webScriptObject setValue:self forKey:@"KeychainPlugin"];
}


//-- isSelectorExcludedFromWebScript
// メソッドの公開
+(BOOL) isSelectorExcludedFromWebScript:(SEL)selector
{
	if(selector == @selector(findInternetPasswordForAccount:server:protocol:)
	   || selector == @selector(removeInternetPasswordForAccount:server:protocol:)
	   || selector == @selector(addAndModifyInternetPassword:account:server:protocol:)
	   || selector == @selector(findGenericPasswordForAccount:service:)
	   || selector == @selector(removeGenericPasswordForAccount:service:)
	   || selector == @selector(addAndModifyGenericPassword:account:service:)
	   || selector == @selector(connect:method:form:handle:)
	   || selector == @selector(isConnecting)
	   || selector == @selector(hasCookieForURL:name:)
	   ){
		return NO;
	}
	return YES;
}


//-- webScriptNameForSelector
// メソッド名の登録
+(NSString*) webScriptNameForSelector:(SEL)selector
{
	if(selector == @selector(findInternetPasswordForAccount:server:protocol:type:)){
		return @"findInternetPassword";
	}else if(selector == @selector(addAndModifyInternetPassword:account:server:protocol:type:)){
		return @"addAndModifyInternetPassword";
	}else if(selector == @selector(removeInternetPassword:account:server:protocol:type:)){
		return @"removeInternetPassword";
	}else if(selector == @selector(findGenericPasswordForAccount:service:)){
		return @"findGenericPassword";
	}else if(selector == @selector(addAndModifyGenericPassword:account:service:)){
		return @"addAndModifyGenericPassword";
	}else if(selector == @selector(removeGenericPasswordForAccount:service:)){
		return @"removeGenericPassword";
	}else if(selector == @selector(connect:method:form:handle:)){
		return @"connect";
	}else if(selector == @selector(isConnecting)){
		return @"isConnecting";
	}else if(selector == @selector(hasCookieForURL:name:)){
		return @"hasSessionCookie";
	}
	return nil;	
}


//-- dealloc
// 後始末
-(void) dealloc
{
	[_connection cancel];
	[_connection release];
	[_handleName release];
	[_receivedData release];
	
	[super dealloc];
}



#pragma mark KeyChains
#pragma mark Internet Password
//-- findInternetPasswordForAccount:server:protocol:
// keychain から パスワードを取得する
-(NSArray*) findInternetPasswordForAccount:(NSString*) account
								   service:(NSString*) servername
								   protocol:(NSString*) protocol
									  type:(NSString*) type
{
	UInt32 length;
	char* data;
	//kSecProtocolTypeHTTPS
	OSStatus status =
		SecKeychainFindInternetPassword( NULL,
										 [servername lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [servername cStringUsingEncoding:NSUTF8StringEncoding],
										 0,
										 NULL,
										 [account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [account cStringUsingEncoding:NSUTF8StringEncoding],
										 0,
										 NULL,
										 0,
										 kSecProtocolTypeHTTP,
										 kSecAuthenticationTypeDefault,
										 &length,
										 (void**)(&data),
										 NULL );
	if(status == noErr){
		NSString* password = [NSString stringWithCString:data encoding:NSUTF8StringEncoding];
		SecKeychainItemFreeContent(NULL, data);
		return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], password, NULL];
	}else{
		return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
	}
}
										 


//-- removeInternetPasswordForAccount:server:protocol:
// keychain から パスワード削除する
-(NSArray*) removeInternetPasswordForAccount:(NSString*) account
								   service:(NSString*) servername
								  protocol:(NSString*) protocol
									  type:(NSString*) type
{
	SecKeychainItemRef itemref;
	
	OSStatus status =
	SecKeychainFindInternetPassword( NULL,
									[servername lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
									[servername cStringUsingEncoding:NSUTF8StringEncoding],
									0,
									NULL,
									[account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
									[account cStringUsingEncoding:NSUTF8StringEncoding],
									0,
									NULL,
									0,
									kSecProtocolTypeHTTP,
									kSecAuthenticationTypeDefault,
									NULL,
									NULL,
									NULL );
	if(status == noErr){
		status = SecKeychainItemDelete(itemref);
		CFRelease(itemref);
	}
	return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
}


	
//-- addAndModifyInternetPassword:account:server:protocol:
// add password to keychain
-(NSArray*) addAndModifyInternetPassword:(NSString*) password
								  account:(NSString*) account
								   server:(NSString*) servername
								 protocol:(NSString*) protocol
									 type:(NSString*) type
{
	SecKeychainItemRef itemRef;
	//kSecProtocolTypeHTTPS
	OSStatus status = 
		SecKeychainFindInternetPassword( NULL,
										 [servername lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [servername cStringUsingEncoding:NSUTF8StringEncoding],
										 0,
										 NULL,
										 [account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [account cStringUsingEncoding:NSUTF8StringEncoding],
										 0,
										 NULL,
										 0,
										 kSecProtocolTypeHTTP,
										 kSecAuthenticationTypeDefault,
										 NULL,
										 NULL,
										 &itemRef );

	if (status == noErr) {
		status = SecKeychainItemModifyContent(itemRef,
											  NULL,
											  [password lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
											  [password cStringUsingEncoding:NSUTF8StringEncoding]);
	}else{
		status =
			SecKeychainAddInternetPassword( NULL,
										[servername lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										[servername cStringUsingEncoding:NSUTF8StringEncoding],
										0,
										NULL,
										[account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										[account cStringUsingEncoding:NSUTF8StringEncoding],
										0,
										NULL,
										0,
										kSecProtocolTypeHTTP,
										kSecAuthenticationTypeDefault,
										[password lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										[password cStringUsingEncoding:NSUTF8StringEncoding],
										&itemRef );
	}
	
	if(itemRef){
		CFRelease(itemRef);
	}
	
	return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
}



#pragma mark Generic Password
//-- findGenericPasswordForAccount:server:protocol:
// keychain から パスワードを取得する
-(NSArray*) findGenericPasswordForAccount:(NSString*) account
								  service:(NSString*) service
{
	UInt32 length;
	char* data;
	//kSecProtocolTypeHTTPS
	OSStatus status =
		SecKeychainFindGenericPassword( NULL,
										 [service lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [service cStringUsingEncoding:NSUTF8StringEncoding],
										 [account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										 [account cStringUsingEncoding:NSUTF8StringEncoding],
										 &length,
										 (void**)(&data),
										 NULL );
	if(status == noErr){
		char* buffer = (char *) malloc((length + 1) * sizeof(char));
		strncpy(buffer, data, length);
		buffer[length] = '\0';
		NSString* password = [NSString stringWithUTF8String:buffer];
		free(buffer);
		SecKeychainItemFreeContent(NULL, data);
		return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], password, NULL];
	}else{
		return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
	}
}


//-- removeGenericPasswordForAccount:server:protocol:
// keychain から パスワードを削除する
-(NSArray*) removeGenericPasswordForAccount:(NSString*) account
									service:(NSString*) service
{
	SecKeychainItemRef itemref;
	OSStatus status =
	SecKeychainFindGenericPassword( NULL,
								   [service lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
								   [service cStringUsingEncoding:NSUTF8StringEncoding],
								   [account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
								   [account cStringUsingEncoding:NSUTF8StringEncoding],
								   NULL,
								   NULL,
								   &itemref );
	if(status == noErr){
		status = SecKeychainItemDelete(itemref);
		CFRelease(itemref);
	}
	return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
}



//-- addAndModifyGenericPassword:service:account:
// keychain に パスワードを設定する
-(NSArray*) addAndModifyGenericPassword:(NSString*) password
								 account:(NSString*) account
								 service:(NSString*) service
{
	SecKeychainItemRef itemRef;
	//kSecProtocolTypeHTTPS
	OSStatus status = 
		SecKeychainFindGenericPassword( NULL,
										[service lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										[service cStringUsingEncoding:NSUTF8StringEncoding],
										[account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
										[account cStringUsingEncoding:NSUTF8StringEncoding],
										NULL,
										NULL,
										&itemRef );
	
	if (status == noErr) {
		if(password){
			status = SecKeychainItemModifyContent(itemRef,
												  NULL,
												  [password lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
												  [password cStringUsingEncoding:NSUTF8StringEncoding]);
		}else{
			status = SecKeychainItemDelete(itemRef);
		}
	}else{
		if(password){
			status =
				SecKeychainAddGenericPassword( NULL,
											   [service lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
											   [service cStringUsingEncoding:NSUTF8StringEncoding],
											   [account lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
											   [account cStringUsingEncoding:NSUTF8StringEncoding],
											   [password lengthOfBytesUsingEncoding:NSUTF8StringEncoding],
											   [password cStringUsingEncoding:NSUTF8StringEncoding],
											   &itemRef );
		}
	}
	
	if(itemRef){
		CFRelease(itemRef);
	}
	
	return [NSArray arrayWithObjects:[NSNumber numberWithInt:status], NULL];
}


#pragma mark NSConnections
//-- connect:handle
// 接続を行う
-(void) connect:(NSString*) path
		 method:(NSString*) method
		   form:(NSString*) form
		 handle:(NSString*) handleName
{
	if([self isConnecting]){
		[self cancel];
	}
	NSMutableURLRequest *request;
	request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:path]];
	[request setHTTPShouldHandleCookies:YES];
	[request setHTTPMethod:method];
	if([method isEqualToString:@"POST"] && form != nil){
		[request setHTTPBody:[form dataUsingEncoding:NSASCIIStringEncoding]];
	}
	_encoding = NSUTF8StringEncoding;
	[self setScriptHandle:handleName];
	_connection = [[NSURLConnection connectionWithRequest:request delegate:self] retain];
	_receivedData = [[NSMutableData data] retain];
}



//-- isConnecting
// 接続中かどうか
-(BOOL) isConnecting
{
	return _connection != nil; 
}


//-- setScriptHandle
// 接続完了時のコールバック関数
-(void) setScriptHandle:(NSString*) handleName
{
	[_handleName release];
	_handleName = [handleName copyWithZone:[self zone]];
}


//-- cancel
// 接続をキャンセルする
-(void) cancel
{
	if(![self isConnecting]){
		return;
	}
	
	[_connection cancel];
	[_connection release];
	_connection = nil;
	
	[_receivedData release];
	_receivedData = nil;
	
}



//-- hasCookieForDomain:name:
// cookieが登録されているかどうかのチェック
-(NSNumber*) hasCookieForURL:(NSString*) path
						name:(NSString*) name
{
	NSURL* url = [NSURL URLWithString:path];
	NSArray* cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:url];
	
	NSEnumerator* e = [cookies objectEnumerator];
	NSHTTPCookie* cookie;
	
	while(cookie = [e nextObject]){
		if([[cookie name] isEqualToString:name]){
			return [NSNumber numberWithInt:1];
		}
	}
	return [NSNumber numberWithInt:0];
}


#pragma mark delegate:NSURLConnection
//-- connection:didReceiveResponse
// ヘッダ受信時のdelegate encodingを取得する
-(void)			connection:(NSURLConnection *) connection
		didReceiveResponse:(NSURLResponse *) response
{
	NSString* encoding = [response textEncodingName];
	if(encoding){
		CFStringEncoding cfencoding = CFStringConvertIANACharSetNameToEncoding((CFStringRef)encoding);
		if(cfencoding == kCFStringEncodingInvalidId) cfencoding = kCFStringEncodingUTF8;
		_encoding = CFStringConvertEncodingToNSStringEncoding(cfencoding);
		//if(_encoding == ) cfencoding = kCFStringEncodingUTF8;
	}else{
		_encoding = NSUTF8StringEncoding;
	}
}


//-- connection:didReceiveData
// 取得したデータの保存
- (void) connection:(NSURLConnection *)connection
	 didReceiveData:(NSData *)data
{
	[_receivedData appendData:data];
}


//-- connectionDidFinishLoading
// ダウンロード完了
-(void) connectionDidFinishLoading:(NSURLConnection *) connection
{
	NSString* string = [[[NSString alloc] initWithData:_receivedData
											  encoding:_encoding] autorelease];
	if(string == nil && _encoding == NSJapaneseEUCStringEncoding){
		string = [self convertReceivedData];
	}
	
	if(string != nil){
		[_webScriptObject callWebScriptMethod:_handleName 
								withArguments:[NSArray arrayWithObjects:[NSNumber numberWithInt:0],
											   string, nil]];
	}else{
		[_webScriptObject callWebScriptMethod:_handleName
								withArguments:[NSArray arrayWithObjects:[NSNumber numberWithInt:2], 
											   @"Illegal encoding", nil]];
	}
	[_receivedData release];
	[_connection release];
	_connection = nil;
	_receivedData = nil;
}


//-- connection:didFailWithError:
// 失敗時の処理
- (void) connection:(NSURLConnection *) connection
	didFailWithError:(NSError *) error
{
	NSString* errorMessage = [error localizedDescription];
	if (!errorMessage) errorMessage = @"";
	[_webScriptObject callWebScriptMethod:_handleName 
							withArguments:[NSArray arrayWithObjects:[NSNumber numberWithInt:1], errorMessage, nil]];
	[_receivedData release];
	[_connection release];
	_connection = nil;
	_receivedData = nil;
}



//-- convertReceivedData
// CP51932としてRecive dataを変換する
-(NSString*) convertReceivedData
{
	const unsigned char* bytes = [_receivedData bytes];
	unsigned char c[3];
	unsigned int location = 0;
	unsigned int end = [_receivedData length];
	NSMutableString* uniString = [[[NSMutableString alloc] init] autorelease];
	
	while(location < end){
		c[0] = bytes[location];
		if(c[0] <= 0x7e){
			[uniString appendString:
			 [[[NSString alloc] initWithBytes:c length:1 encoding:NSJapaneseEUCStringEncoding] autorelease]];
			location += 1;
		}else if(c[0] == 0x8f){
			c[1] = bytes[location + 1];
			c[2] = bytes[location + 2];
			if(c[1] >= 0xa1 && c[1] <= 0xfe && c[2] >= 0xa1 && c[2] <=0xfe){
				[uniString appendString:
				 [[[NSString alloc] initWithBytes:c length:3 encoding:NSJapaneseEUCStringEncoding] autorelease]];
				location += 3;
			}else{
				location += 1;
			}
		}else if(c[0] == 0x8e || (c[0] >= 0xa1 && c[0] <= 0xfe)){
			c[1] = bytes[location + 1];
			if(c[1] >= 0xa1 && c[1] <= 0xfe){
				if(c[0] == 0xad){
					if(c[1] >= 0xa0){ // NEC特殊文字
						NSInteger index = c[1] - 0xa0;
						if(NECSpecialCharactors[index] != 0x0000){
							[uniString appendFormat:@"%C", NECSpecialCharactors[index]];
						}
					}
					location += 2;
				}else if(c[0] >= 0xf9 && c[0] <= 0xfc){ //NEC選定IBM拡張文字
					if(c[1] >= 0xa0){
						NSInteger index = (c[0] - 0xf9) * 0x60 + (c[1] - 0xa0);
						if(IBMSpecialCharactors[index] != 0x0000){
							[uniString appendFormat:@"%C", IBMSpecialCharactors[index]];
						}
					}
					location += 2;
				}else{
					[uniString appendString:
					 [[[NSString alloc] initWithBytes:c length:2 encoding:NSJapaneseEUCStringEncoding] autorelease]];
					location += 2;
				}
			}else{
				location += 1;
			}
		}else{
			location += 1;
		}
		
	}
	return uniString;
}

@end
