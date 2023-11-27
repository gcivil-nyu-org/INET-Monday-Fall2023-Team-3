# consumers.py
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json


class CommentConsumer(WebsocketConsumer):
    def connect(self):
        
        self.group_name = "comments"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        # Handle disconnection
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json["action"]
        if action == "create":
            response = {"type": "new_comment", "data": text_data_json["data"]}
        elif action == "update":
            response = {"type": "update_comment", "data": text_data_json["data"]}
        elif action == "delete":
            response = {"type": "delete_comment", "data": text_data_json["data"]}
        elif action == "open":
            response = {"type": "open_conn", "data": "open connection"}
        else:
            response = {"type": "error", "data": "error occurs"}

        # Send the response message to the WebSocket group
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,  # The name of the group to send to
            response,  # The response message
        )

        print(json.dumps(response))

    def new_comment(self, event):
        async_to_sync(self.send(text_data=json.dumps(event)))

    def update_comment(self, event):
        async_to_sync(self.send(text_data=json.dumps(event)))

    def delete_comment(self, event):
        async_to_sync(self.send(text_data=json.dumps(event)))

    def open_conn(self, event):
        async_to_sync(self.send(text_data=json.dumps(event)))

    def error(self, event):
        async_to_sync(self.send(text_data=json.dumps(event)))
