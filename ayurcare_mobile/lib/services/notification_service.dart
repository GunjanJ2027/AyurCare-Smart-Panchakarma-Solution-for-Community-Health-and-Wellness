import 'package:flutter/foundation.dart'; // REQUIRED FOR kIsWeb
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    // 🛑 If on Web, skip initialization completely!
    if (kIsWeb) return;

    tz.initializeTimeZones();
    tz.setLocalLocation(tz.getLocation('Asia/Kolkata'));

    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initSettings = InitializationSettings(android: androidSettings, iOS: iosSettings);
    
    await _notificationsPlugin.initialize(initSettings);
    await _notificationsPlugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestNotificationsPermission();
  }

  static Future<void> scheduleTherapyReminders({
    required int id,
    required String therapyName,
    required DateTime scheduledTime,
  }) async {
    // 🛑 If on Web, do not try to schedule alarms
    if (kIsWeb) return;

    const NotificationDetails details = NotificationDetails(
      android: AndroidNotificationDetails('therapy_reminders', 'Therapy Reminders', importance: Importance.max, priority: Priority.high),
    );

    final oneDayBefore = scheduledTime.subtract(const Duration(days: 1));
    if (oneDayBefore.isAfter(DateTime.now())) {
      await _notificationsPlugin.zonedSchedule(
        id * 10, 'Upcoming: $therapyName', 'Your therapy is tomorrow!',
        tz.TZDateTime.from(oneDayBefore, tz.local), details,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      );
    }
  }

  static Future<void> cancelAll() async {
    // 🛑 If on Web, do not try to cancel alarms
    if (kIsWeb) return;
    await _notificationsPlugin.cancelAll();
  }
}