//
//  MixiWidgetPlugin.h
//
//  $Revision: 13M $
//  $Date: 2007-03-29 10:48:57 +0900 (Thu, 29 Mar 2007) $
//

#import <Cocoa/Cocoa.h>
#import <WebKit/Webkit.h>


@interface MixiWidgetPlugin : NSObject {
	WebScriptObject* _webScriptObject;
	
	NSURLConnection*	_connection;
	NSMutableData*		_receivedData;
	NSStringEncoding	_encoding;
	
	NSString*       _handleName;
}


-(id) initWithWebView:(WebView*) webView;
-(void) windowScriptObjectAvailable:(WebScriptObject*) webScriptObject;
+(BOOL) isSelectorExcludedFromWebScript:(SEL)selector;
+(NSString*) webScriptNameForSelector:(SEL)selector;
-(NSArray*) findInternetPasswordForAccount:(NSString*) account
								   service:(NSString*) servername
								  protocol:(NSString*) protocol
									  type:(NSString*) type;
-(NSArray*) removeInternetPasswordForAccount:(NSString*) account
								   service:(NSString*) servername
								  protocol:(NSString*) protocol
									  type:(NSString*) type;
-(NSArray*) addAndModifyInternetPassword:(NSString*) password
								 account:(NSString*) account
								  server:(NSString*) servername
								protocol:(NSString*) protocol
									type:(NSString*) type;
-(NSArray*) findGenericPasswordForAccount:(NSString*) account
								  service:(NSString*) service;
-(NSArray*) removeGenericPasswordForAccount:(NSString*) account
								  service:(NSString*) service;
-(NSArray*) addAndModifyGenericPassword:(NSString*) password
								 account:(NSString*) account
								 service:(NSString*) service;


-(void) connect:(NSString*)path method:(NSString*)method form:(NSString*)form handle:(NSString*)handleName;
-(BOOL) isConnecting;
-(void) setScriptHandle:(NSString*)handleName;
-(void) cancel;
-(NSNumber*) hasCookieForURL:(NSString*)path name:(NSString*)name;
-(void)	connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response;
-(void) connection:(NSURLConnection *)connection didReceiveData:(NSData *)data;
-(void) connectionDidFinishLoading:(NSURLConnection *)connection;
-(void) connection:(NSURLConnection *)connection didFailWithError:(NSError *) error;
-(NSString*) convertReceivedData;

@end
