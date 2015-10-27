package com.dimab.smsmail;

/* todo(egor): review
import org.smslib.AGateway;
import org.smslib.IGatewayStatusNotification;
import org.smslib.IOutboundMessageNotification;
import org.smslib.Library;
import org.smslib.OutboundMessage;
import org.smslib.Service;
import org.smslib.AGateway.GatewayStatuses;
import org.smslib.smpp.BindAttributes;
import org.smslib.smpp.BindAttributes.BindType;
import org.smslib.smpp.jsmpp.JSMPPGateway;
*/

public class SendSMStest {
/*
	public void doIt() throws Exception
	{
		GatewayStatusNotification statusNotification = new GatewayStatusNotification();
		OutboundNotification outboundNotification = new OutboundNotification();
		OutboundMessage msg;
		System.out.println("Example: Send messages through SMPP using JSMPP.");
		System.out.println(Library.getLibraryDescription());
		System.out.println("Version: " + Library.getLibraryVersion());
		JSMPPGateway gateway = new JSMPPGateway("smppcon", "dimaPK", 2775, new BindAttributes("dimatest", "123456", "cp", BindType.TRANSMITTER));
		Service.getInstance().addGateway(gateway);
		Service.getInstance().setGatewayStatusNotification(statusNotification);
		Service.getInstance().setOutboundMessageNotification(outboundNotification);
		Service.getInstance().startService();
		// Send a message.
		msg = new OutboundMessage("+972526775065", "Hello from pick o place");
		Service.getInstance().sendMessage(msg);
		System.out.println(msg);
		System.out.println("Now Sleeping - Hit <enter> to terminate.");
		//System.in.read();
		Service.getInstance().stopService();
	}



	public class OutboundNotification implements IOutboundMessageNotification
	{
		public void process(AGateway gateway, OutboundMessage msg)
		{
			System.out.println("Outbound handler called from Gateway: " + gateway.getGatewayId());
			System.out.println(msg);
		}
	}

	public class GatewayStatusNotification implements IGatewayStatusNotification
	{
		public void process(AGateway gateway, GatewayStatuses oldStatus, GatewayStatuses newStatus)
		{
			System.out.println(">>> Gateway Status change for " + gateway.getGatewayId() + ", OLD: " + oldStatus + " -> NEW: " + newStatus);
		}
	}
*/
}
