// lib/main.dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'screens/login_screen.dart';
import 'screens/patient_dashboard.dart';
// Note: Practitioner and Admin imports have been removed!

void main() {
  runApp(const AyurCareApp());
}

class AyurCareApp extends StatelessWidget {
  const AyurCareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AyurCare',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF10B981), // Your AyurGreen!
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      home: const InitialRouter(),
    );
  }
}

class InitialRouter extends StatefulWidget {
  const InitialRouter({super.key});

  @override
  _InitialRouterState createState() => _InitialRouterState();
}

class _InitialRouterState extends State<InitialRouter> {
  final _storage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    String? token = await _storage.read(key: 'token');
    String? role = await _storage.read(key: 'userRole');

    if (!mounted) return;

    if (token != null && role != null) {
      if (role == 'Patient') {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const PatientDashboard()));
      } else {
        // If a doctor somehow gets a token on the mobile app, kick them out
        await _storage.deleteAll();
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      }
    } else {
      // No token found, go to login
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(color: Color(0xFF10B981)),
      ),
    );
  }
}