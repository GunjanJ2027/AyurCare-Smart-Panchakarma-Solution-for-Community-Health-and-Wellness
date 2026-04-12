import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fl_chart/fl_chart.dart'; 
import 'login_screen.dart';
import '../services/notification_service.dart';
import 'package:url_launcher/url_launcher.dart'; 

// --- NEW PDF IMPORTS ---
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import 'dosha_quiz.dart';
import 'chatbot_screen.dart';

const String baseUrl = "http://10.0.2.2:5000";

class PatientDashboard extends StatefulWidget {
  const PatientDashboard({super.key});

  @override
  _PatientDashboardState createState() => _PatientDashboardState();
}

class _PatientDashboardState extends State<PatientDashboard> {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final Color ayurGreen = const Color(0xFF10B981);
  
  int _currentIndex = 0;
  bool _isLoading = true;
  
  Map<String, dynamic>? _patientData;
  List<dynamic> _myAppointments = [];
  Map<String, dynamic>? _reminderData;
  List<dynamic> _healthLogs = []; 

  // --- THERAPY PLAN STATE VARIABLES ---
  String _therapyDuration = "";
  List<dynamic> _therapyStages = [];
  List<String> _pathya = [];
  List<String> _apathya = [];
  List<Map<String, dynamic>> _dynamicMedicines = [];
  List<String> _dynamicPreProtocol = [];
  List<String> _dynamicPostProtocol = [];

  // --- DISCOVER TAB STATE ---
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    NotificationService.init();
    _fetchMyData();
  }

  Future<void> _fetchMyData() async {
    try {
      String? token = await _storage.read(key: 'token');
      if (token == null) {
        _logout();
        return;
      }

      final dashRes = await http.get(Uri.parse('$baseUrl/api/patient/dashboard'), headers: {'x-auth-token': token});
      final remRes = await http.get(Uri.parse('$baseUrl/api/patient/reminders'), headers: {'x-auth-token': token});
      final logsRes = await http.get(Uri.parse('$baseUrl/api/patient/health-logs'), headers: {'x-auth-token': token});

      if (dashRes.statusCode == 200 && remRes.statusCode == 200) {
        final data = jsonDecode(dashRes.body);
        final remData = jsonDecode(remRes.body);

        setState(() {
          _patientData = data['patient'] ?? data;
          _myAppointments = data['appointments'] ?? [];
          _reminderData = remData;

          if (logsRes.statusCode == 200) {
             _healthLogs = jsonDecode(logsRes.body); 
          }

          if (remData['instructions'] != null) {
            var inst = remData['instructions'];
            _therapyDuration = inst['duration'] ?? "Varies";
            _therapyStages = inst['stages'] ?? [];
            _pathya = List<String>.from(inst['diet']?['pathya'] ?? []);
            _apathya = List<String>.from(inst['diet']?['apathya'] ?? []);
            _dynamicPreProtocol = List<String>.from(inst['pre'] ?? []);
            _dynamicPostProtocol = List<String>.from(inst['post'] ?? []);
            
            if (inst['medicines'] != null) {
              _dynamicMedicines = List<String>.from(inst['medicines']).map((med) {
                var parts = med.split('(');
                return {'name': parts[0].trim(), 'time': parts.length > 1 ? parts[1].replaceAll(')', '').trim() : 'As prescribed', 'isTaken': false};
              }).toList();
            } else {
              _dynamicMedicines = [];
            }
          }
          _isLoading = false;
        });

        NotificationService.cancelAll(); 
        int index = 0;
        for (var appt in _myAppointments) {
          if (appt['status'] == 'Scheduled') {
            NotificationService.scheduleTherapyReminders(
              id: index,
              therapyName: appt['therapyName'],
              scheduledTime: _parseDateTime(appt['scheduledDate'], appt['time']),
            );
            index++;
          }
        }
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print("Error fetching dynamic data: $e");
      setState(() => _isLoading = false);
    }
  }

  DateTime _parseDateTime(String dateStr, String timeStr) {
    String datePart = dateStr.substring(0, 10);
    List<String> timeParts = timeStr.split(' ');
    List<String> hoursMins = timeParts[0].split(':');
    int hour = int.parse(hoursMins[0]);
    int minute = int.parse(hoursMins[1]);
    if (timeParts[1] == 'PM' && hour != 12) hour += 12;
    if (timeParts[1] == 'AM' && hour == 12) hour = 0;
    return DateTime.parse("${datePart}T${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}:00");
  }

  void _logout() async {
    await _storage.deleteAll();
    if (!mounted) return;
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
  }

  Future<void> _handleBookingSubmit(String therapy, DateTime date, String time, String? rescheduleId) async {
    try {
      final token = await _storage.read(key: 'token');
      if (rescheduleId != null) {
        await http.delete(Uri.parse('$baseUrl/api/patient/appointment/$rescheduleId/cancel'), headers: {'x-auth-token': token ?? ''});
      }
      final res = await http.post(
        Uri.parse('$baseUrl/api/patient/book'),
        headers: {'Content-Type': 'application/json', 'x-auth-token': token ?? ''},
        body: jsonEncode({'therapyName': therapy, 'date': date.toString().substring(0, 10), 'time': time}),
      );
      if (res.statusCode == 201) {
        _fetchMyData(); 
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(rescheduleId == null ? 'Therapy Booked!' : 'Schedule Updated!'), backgroundColor: Colors.green));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Error processing request'), backgroundColor: Colors.red));
    }
  }

  Future<void> _cancelAppointment(String id) async {
    try {
      final token = await _storage.read(key: 'token');
      final res = await http.delete(Uri.parse('$baseUrl/api/patient/appointment/$id/cancel'), headers: {'x-auth-token': token ?? ''});
      if (res.statusCode == 200) {
        _fetchMyData();
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Session Cancelled"), backgroundColor: Colors.orange));
      }
    } catch (e) {
      print("Cancel Error: $e");
    }
  }

  void _showDailyLogDialog() {
    double energy = 5;
    double digestion = 5;
    double sleep = 5;
    TextEditingController symptomsController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) {
        return StatefulBuilder(builder: (context, setModalState) {
          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Log Today's Health", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
                const SizedBox(height: 20),
                Text("Energy Level: ${energy.toInt()}/10", style: const TextStyle(fontWeight: FontWeight.bold)),
                Slider(value: energy, min: 1, max: 10, activeColor: Colors.green, onChanged: (v) => setModalState(() => energy = v)),
                Text("Digestion Quality: ${digestion.toInt()}/10", style: const TextStyle(fontWeight: FontWeight.bold)),
                Slider(value: digestion, min: 1, max: 10, activeColor: Colors.orange, onChanged: (v) => setModalState(() => digestion = v)),
                Text("Sleep Quality: ${sleep.toInt()}/10", style: const TextStyle(fontWeight: FontWeight.bold)),
                Slider(value: sleep, min: 1, max: 10, activeColor: Colors.blue, onChanged: (v) => setModalState(() => sleep = v)),
                const SizedBox(height: 10),
                TextField(
                  controller: symptomsController,
                  decoration: InputDecoration(hintText: "Any unusual symptoms? (e.g. slight headache)", filled: true, fillColor: Colors.grey.shade50, border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none)),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: ayurGreen, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                    onPressed: () async {
                      final token = await _storage.read(key: 'token');
                      await http.post(
                        Uri.parse('$baseUrl/api/patient/health-log'),
                        headers: {'Content-Type': 'application/json', 'x-auth-token': token ?? ''},
                        body: jsonEncode({'energy': energy, 'digestion': digestion, 'sleep': sleep, 'symptoms': symptomsController.text}),
                      );
                      Navigator.pop(context);
                      _fetchMyData(); 
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Health logged successfully!"), backgroundColor: Colors.green));
                    },
                    child: const Text("Save Log", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          );
        });
      },
    );
  }

  void _showBookingDialog({String? rescheduleId}) {
    String selectedTherapy = 'Abhyanga (Oil Massage)';
    DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
    String? selectedTime;
    List<String> availableSlots = [];
    bool isFetchingSlots = false;
    final List<String> therapies = ['Abhyanga (Oil Massage)', 'Virechana (Detox)', 'Basti', 'Shirodhara', 'Nasya'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) {
        return StatefulBuilder(builder: (context, setModalState) {
          Future<void> fetchSlots(DateTime date) async {
            setModalState(() { isFetchingSlots = true; availableSlots = []; });
            try {
              final String dateStr = date.toString().substring(0, 10);
              final token = await _storage.read(key: 'token');
              final res = await http.get(Uri.parse('$baseUrl/api/patient/available-slots?date=$dateStr'), headers: {'x-auth-token': token ?? ''}).timeout(const Duration(seconds: 7)); 
              if (res.statusCode == 200) {
                setModalState(() { availableSlots = List<String>.from(jsonDecode(res.body)); isFetchingSlots = false; });
              } else { throw Exception("Server Error"); }
            } catch (e) {
              setModalState(() => isFetchingSlots = false);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Connection Failed: $e"), backgroundColor: Colors.red));
            }
          }
          if (availableSlots.isEmpty && !isFetchingSlots) fetchSlots(selectedDate);
          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(rescheduleId == null ? "Schedule Therapy" : "Reschedule Session", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
                const SizedBox(height: 20),
                const Text("Panchakarma Treatment", style: TextStyle(fontWeight: FontWeight.bold)),
                DropdownButtonFormField<String>(
                  initialValue: selectedTherapy,
                  items: therapies.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                  onChanged: (val) => setModalState(() => selectedTherapy = val!),
                  decoration: InputDecoration(filled: true, fillColor: Colors.grey.shade50, border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none)),
                ),
                const SizedBox(height: 20),
                const Text("Select Date", style: TextStyle(fontWeight: FontWeight.bold)),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(selectedDate.toString().substring(0, 10), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  trailing: Icon(Icons.calendar_month, color: ayurGreen),
                  onTap: () async {
                    final picked = await showDatePicker(context: context, initialDate: selectedDate, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 60)));
                    if (picked != null) { setModalState(() => selectedDate = picked); fetchSlots(picked); }
                  },
                ),
                const Divider(),
                const Text("Available Time Slots", style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                if (isFetchingSlots) const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()))
                else Wrap(
                  spacing: 10,
                  children: availableSlots.map((time) => ChoiceChip(
                    label: Text(time), selected: selectedTime == time, selectedColor: ayurGreen.withOpacity(0.2), onSelected: (bool selected) => setModalState(() => selectedTime = time),
                  )).toList(),
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: ayurGreen, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                    onPressed: selectedTime == null ? null : () async {
                      _handleBookingSubmit(selectedTherapy, selectedDate, selectedTime!, rescheduleId);
                      Navigator.pop(context);
                    },
                    child: Text(rescheduleId == null ? "Confirm Booking" : "Update Schedule", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          );
        });
      },
    );
  }

  void _showFeedbackDialog(String apptId) {
    int rating = 5;
    TextEditingController commentController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text("Rate your Session"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text("How was your experience?"),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) => IconButton(
                  icon: Icon(Icons.star, color: index < rating ? Colors.amber : Colors.grey),
                  onPressed: () => setDialogState(() => rating = index + 1),
                )),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: commentController, 
                maxLines: 3, 
                decoration: InputDecoration(
                  hintText: "How do you feel? Please report any discomfort or issues here...", 
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)), 
                  filled: true, 
                  fillColor: Colors.grey.shade50
                )
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: ayurGreen, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
              onPressed: () async {
                final token = await _storage.read(key: 'token');
                await http.post(
                  Uri.parse('$baseUrl/api/patient/appointment/$apptId/feedback'),
                  headers: {'Content-Type': 'application/json', 'x-auth-token': token ?? ''},
                  body: jsonEncode({'rating': rating, 'comment': commentController.text}),
                );
                Navigator.pop(context);
                _fetchMyData(); 
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Thank you for your feedback!")));
              },
              child: const Text("Submit", style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      ),
    );
  }

  // --- PDF GENERATION LOGIC ---
  Future<void> _generateAndSharePDF() async {
    final pdf = pw.Document();
    
    // Filter completed appointments
    final completedAppts = _myAppointments.where((a) => a['status'] == 'Completed').toList();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Header
              pw.Container(
                padding: const pw.EdgeInsets.all(20),
                decoration: const pw.BoxDecoration(color: PdfColors.teal800),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text("AyurCare Digital Health Record", style: pw.TextStyle(color: PdfColors.white, fontSize: 24, fontWeight: pw.FontWeight.bold)),
                    pw.Text("EHR", style: pw.TextStyle(color: PdfColors.white, fontSize: 24)),
                  ]
                )
              ),
              pw.SizedBox(height: 20),
              
              // Patient Info
              pw.Text("Patient Details", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.teal800)),
              pw.Divider(),
              pw.Text("Name: ${_patientData?['name'] ?? 'Not Specified'}", style: const pw.TextStyle(fontSize: 14)),
              pw.Text("Email: ${_patientData?['email'] ?? 'Not Specified'}", style: const pw.TextStyle(fontSize: 14)),
              pw.Text("Prakriti (Dosha): ${_patientData?['doshaProfile'] ?? 'Pending Assessment'}", style: const pw.TextStyle(fontSize: 14)),
              pw.SizedBox(height: 30),

              // Active Prescriptions
              pw.Text("Active Prescriptions & Protocol", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.teal800)),
              pw.Divider(),
              if (_dynamicMedicines.isEmpty) pw.Text("No active medicines prescribed.")
              else ..._dynamicMedicines.map((med) => pw.Bullet(text: "${med['name']} - ${med['time']}")),
              pw.SizedBox(height: 30),

              // Past Treatments
              pw.Text("Treatment History", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: PdfColors.teal800)),
              pw.Divider(),
              if (completedAppts.isEmpty) pw.Text("No completed treatments yet.")
              else ...completedAppts.map((appt) {
                return pw.Container(
                  margin: const pw.EdgeInsets.only(bottom: 10),
                  child: pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text("${appt['therapyName']} - ${appt['scheduledDate']?.substring(0,10)}", style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                      if (appt['notes'] != null) pw.Text("Notes: ${appt['notes']}", style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
                    ]
                  )
                );
              }),
            ],
          );
        },
      ),
    );

    // Triggers the native iOS/Android share sheet to save/print/email the PDF
    await Printing.sharePdf(bytes: await pdf.save(), filename: 'AyurCare_Health_Record.pdf');
  }

  // --- WIDGET BUILDERS ---

  Widget _buildHealthChart() {
    if (_healthLogs.isEmpty) {
      return Container(
        margin: const EdgeInsets.only(top: 24),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade200)),
        child: Column(
          children: [
            const Center(child: Text("No health data logged yet. Log your first day to see your progress chart!", textAlign: TextAlign.center, style: TextStyle(color: Colors.grey))),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: ayurGreen),
              onPressed: _showDailyLogDialog,
              child: const Text("Log Today's Health", style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      );
    }

    List<FlSpot> energySpots = [];
    List<FlSpot> digestionSpots = [];
    List<FlSpot> sleepSpots = [];
    
    for (int i = 0; i < _healthLogs.length; i++) {
      double x = i.toDouble();
      energySpots.add(FlSpot(x, (_healthLogs[i]['energy'] ?? 0).toDouble()));
      digestionSpots.add(FlSpot(x, (_healthLogs[i]['digestion'] ?? 0).toDouble()));
      sleepSpots.add(FlSpot(x, (_healthLogs[i]['sleep'] ?? 0).toDouble()));
    }

    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade200)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Vital Trends", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              TextButton.icon(
                onPressed: _showDailyLogDialog, 
                icon: const Icon(Icons.add, size: 16), 
                label: const Text("Log Today"),
                style: TextButton.styleFrom(foregroundColor: ayurGreen),
              )
            ],
          ),
          const SizedBox(height: 8),
          const Row(
            children: [
              Icon(Icons.circle, color: Colors.green, size: 10), SizedBox(width: 4), Text("Energy", style: TextStyle(fontSize: 10)), SizedBox(width: 8),
              Icon(Icons.circle, color: Colors.orange, size: 10), SizedBox(width: 4), Text("Digestion", style: TextStyle(fontSize: 10)), SizedBox(width: 8),
              Icon(Icons.circle, color: Colors.blue, size: 10), SizedBox(width: 4), Text("Sleep", style: TextStyle(fontSize: 10)),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                minY: 0, maxY: 10,
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)), 
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(spots: energySpots, isCurved: true, color: Colors.green, barWidth: 3, dotData: const FlDotData(show: true)),
                  LineChartBarData(spots: digestionSpots, isCurved: true, color: Colors.orange, barWidth: 3, dotData: const FlDotData(show: true)),
                  LineChartBarData(spots: sleepSpots, isCurved: true, color: Colors.blue, barWidth: 3, dotData: const FlDotData(show: true)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecoveryProgress() {
    int totalSessions = 7; 
    int completed = _myAppointments.where((a) => a['status'] == 'Completed').length;
    double percent = (completed / totalSessions).clamp(0.0, 1.0);

    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade200)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Healing Progress", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text("${(percent * 100).toInt()}%", style: TextStyle(color: ayurGreen, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(value: percent, backgroundColor: Colors.grey.shade100, color: ayurGreen, minHeight: 10, borderRadius: BorderRadius.circular(5)),
          const SizedBox(height: 12),
          Text("You have completed $completed of $totalSessions sessions in this cycle.", style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildSmartReminders() {
    if (_reminderData == null || _reminderData?['type'] == 'General') return const SizedBox.shrink();
    
    String topTip = _dynamicPreProtocol.isNotEmpty ? _dynamicPreProtocol.first : "Stay hydrated and rest well.";

    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.orange.shade100)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.notifications_active, color: Colors.orange, size: 20),
              const SizedBox(width: 8),
              Text("SMART REMINDER", style: TextStyle(color: Colors.orange.shade900, fontWeight: FontWeight.bold, letterSpacing: 1.2, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          Text("Your ${_reminderData!['therapyName']} is approaching!", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text("💡 Alert: $topTip", style: const TextStyle(fontSize: 14, color: Colors.black87)),
        ],
      ),
    );
  }

  Widget _buildMedicineTracker() {
    if (_dynamicMedicines.isEmpty) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.blue.shade100)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Prescribed Medicines", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 16),
          ..._dynamicMedicines.asMap().entries.map((entry) {
            int idx = entry.key;
            var med = entry.value;
            return Column(
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => setState(() => _dynamicMedicines[idx]['isTaken'] = !_dynamicMedicines[idx]['isTaken']), 
                      child: Icon(med['isTaken'] ? Icons.check_circle : Icons.radio_button_unchecked, color: med['isTaken'] ? ayurGreen : Colors.grey, size: 28)
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: InkWell(
                        onTap: () => setState(() => _dynamicMedicines[idx]['isTaken'] = !_dynamicMedicines[idx]['isTaken']),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(med['name'], style: TextStyle(fontWeight: FontWeight.w600, decoration: med['isTaken'] ? TextDecoration.lineThrough : null, color: med['isTaken'] ? Colors.grey : Colors.black87)),
                            Text(med['time'], style: const TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.alarm_add, size: 20, color: med['isTaken'] ? Colors.grey : Colors.blue), 
                      onPressed: med['isTaken'] ? null : () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Reminder set for ${med['name']}!"), behavior: SnackBarBehavior.floating)),
                    ),
                  ],
                ),
                if (idx != _dynamicMedicines.length - 1) const Divider(),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildHomeTab() {
    final displayAppts = _myAppointments.where((a) => a['status'] != 'Cancelled').toList();

    return RefreshIndicator(
      color: ayurGreen,
      onRefresh: _fetchMyData,
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text("Namaste, ${_patientData?['name'] ?? 'Friend'}", style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
          const SizedBox(height: 24),
          
          InkWell(
            onTap: () async {
              bool? updated = await Navigator.push(context, MaterialPageRoute(builder: (_) => const DoshaQuiz()));
              if (updated == true) _fetchMyData(); 
            },
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [ayurGreen, const Color(0xFF059669)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: ayurGreen.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(children: [Icon(Icons.spa, color: Colors.white, size: 24), SizedBox(width: 8), Text("Your Ayurvedic Profile", style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600))]),
                  const SizedBox(height: 12),
                  Text(_patientData?['doshaProfile'] ?? 'Pending Assessment', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text("Tap here to complete your Prakriti quiz.", style: TextStyle(color: Colors.white70, fontSize: 13, decoration: TextDecoration.underline)),
                ],
              ),
            ),
          ),

          _buildSmartReminders(),
          _buildMedicineTracker(),
          _buildHealthChart(),
          _buildRecoveryProgress(),
          
          const SizedBox(height: 32),
          const Text("Therapy Sessions", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
          const SizedBox(height: 16),

          if (displayAppts.isEmpty)
            const Center(child: Padding(padding: EdgeInsets.all(40), child: Text("No therapies scheduled.", style: TextStyle(color: Colors.grey))))
          else
            ...displayAppts.map((appt) => Card(
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
              margin: const EdgeInsets.only(bottom: 16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: ayurGreen.withOpacity(0.1), borderRadius: BorderRadius.circular(12)), child: Icon(Icons.water_drop, color: ayurGreen, size: 28)),
                        const SizedBox(width: 16),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(appt['therapyName'] ?? 'Panchakarma', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          Text("${appt['scheduledDate']?.substring(0,10)} at ${appt['time']}", style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                        ])),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), 
                          decoration: BoxDecoration(color: appt['status'] == 'Completed' ? Colors.green.shade50 : Colors.blue.shade50, borderRadius: BorderRadius.circular(20)), 
                          child: Text(appt['status'] ?? 'Scheduled', style: TextStyle(color: appt['status'] == 'Completed' ? Colors.green.shade700 : Colors.blue.shade700, fontSize: 10, fontWeight: FontWeight.bold))
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    
                    if (appt['notes'] != null && appt['notes'].toString().isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 12.0),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: Colors.amber.shade50, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.amber.shade100)),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(Icons.edit_note, size: 18, color: Colors.amber.shade800),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  "Practitioner Note: ${appt['notes']}", 
                                  style: TextStyle(fontSize: 12, color: Colors.amber.shade900, fontStyle: FontStyle.italic),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                    if (appt['status'] == 'Completed' && appt['feedback'] == null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () => _showFeedbackDialog(appt['_id']),
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.amber.shade100, elevation: 0),
                            child: const Text("Rate this Experience ⭐", style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ),

                    if (appt['status'] != 'Completed')
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(onPressed: () => _cancelAppointment(appt['_id']), child: const Text("Cancel", style: TextStyle(color: Colors.red))),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: () => _showBookingDialog(rescheduleId: appt['_id']),
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue.shade50, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                            child: Text("Reschedule", style: TextStyle(color: Colors.blue.shade700, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      )
                  ],
                ),
              ),
            )),
        ],
      ),
    );
  }

  Widget _buildTherapyPlanTab() {
    String therapyType = _reminderData?['therapyName'] ?? "General Wellness";

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: const Color(0xFF064E3B), borderRadius: BorderRadius.circular(20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Active Protocol", style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w600)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(color: ayurGreen.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                    child: Text("⏱ $_therapyDuration", style: TextStyle(color: ayurGreen, fontWeight: FontWeight.bold, fontSize: 12)),
                  )
                ],
              ),
              const SizedBox(height: 8),
              Text(therapyType, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
        const SizedBox(height: 24),

        const Text("Panchakarma Stages", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        const SizedBox(height: 16),
        if (_therapyStages.isEmpty) const Text("No specific stages defined.", style: TextStyle(color: Colors.grey)),
        ..._therapyStages.asMap().entries.map((entry) {
          int idx = entry.key;
          var stage = entry.value;
          return Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    CircleAvatar(radius: 14, backgroundColor: ayurGreen.withOpacity(0.2), child: Text("${idx + 1}", style: TextStyle(color: ayurGreen, fontWeight: FontWeight.bold, fontSize: 12))),
                    if (idx != _therapyStages.length - 1) Container(height: 40, width: 2, color: ayurGreen.withOpacity(0.2)),
                  ],
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(stage['phase'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Text(stage['desc'], style: TextStyle(color: Colors.grey.shade700, fontSize: 13, height: 1.4)),
                    ],
                  ),
                )
              ],
            ),
          );
        }),

        const Divider(height: 40),

        const Text("Ayurvedic Diet Plan", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        const SizedBox(height: 16),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.green.shade100)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [Icon(Icons.check_circle, color: Colors.green.shade700, size: 18), const SizedBox(width: 8), Text("Pathya (Do's)", style: TextStyle(color: Colors.green.shade900, fontWeight: FontWeight.bold))]),
                    const SizedBox(height: 12),
                    ..._pathya.map((item) => Padding(padding: const EdgeInsets.only(bottom: 6), child: Text("• $item", style: TextStyle(fontSize: 13, color: Colors.green.shade900)))),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.red.shade100)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [Icon(Icons.cancel, color: Colors.red.shade700, size: 18), const SizedBox(width: 8), Text("Apathya (Don'ts)", style: TextStyle(color: Colors.red.shade900, fontWeight: FontWeight.bold))]),
                    const SizedBox(height: 12),
                    ..._apathya.map((item) => Padding(padding: const EdgeInsets.only(bottom: 6), child: Text("• $item", style: TextStyle(fontSize: 13, color: Colors.red.shade900)))),
                  ],
                ),
              ),
            ),
          ],
        ),

        const Divider(height: 40),

        const Text("Daily Guidance Checklist", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        const SizedBox(height: 12),
        const Text("Pre-Therapy Check", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
        const SizedBox(height: 8),
        ..._dynamicPreProtocol.map((task) => _buildChecklistItem(task, Icons.assignment_turned_in, Colors.blue)),
        const SizedBox(height: 16),
        const Text("Post-Therapy Care", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.grey)),
        const SizedBox(height: 8),
        ..._dynamicPostProtocol.map((task) => _buildChecklistItem(task, Icons.spa, Colors.green)),
      ],
    );
  }

  Widget _buildDiscoverTab() {
    final List<String> categories = ['All', 'Therapies', 'Diet', 'Lifestyle', 'What to Expect'];
    
    final List<Map<String, dynamic>> content = [
      {"title": "Shiro & Abhyanga: The Healing Oil Massage", "category": "Therapies", "type": "Video", "time": "6 min watch", "icon": Icons.water_drop, "color": Colors.blue, "url": "https://www.youtube.com/watch?v=Lwt4TxkMc7A"},
      {"title": "Ayurveda Diet: What to Eat Based on Body Type", "category": "Diet", "type": "Video", "time": "12 min watch", "icon": Icons.restaurant, "color": Colors.orange, "url": "https://www.youtube.com/watch?v=95B26MzXJAU"},
      {"title": "Is Virechana beneficial for Detox?", "category": "What to Expect", "type": "Video", "time": "7 min watch", "icon": Icons.info_outline, "color": Colors.purple, "url": "https://www.youtube.com/watch?v=7XNf15jBJs4"},
      {"title": "Dinacharya: The Ayurvedic Daily Routine", "category": "Lifestyle", "type": "Article", "time": "10 min read", "icon": Icons.wb_sunny, "color": Colors.amber, "url": "https://www.banyanbotanicals.com/blogs/wellness/dinacharya-balance-and-daily-routine"},
      {"title": "The Incredible Benefits of Panchakarma", "category": "What to Expect", "type": "Video", "time": "8 min watch", "icon": Icons.play_circle_fill, "color": Colors.redAccent, "url": "https://www.youtube.com/watch?v=Pg2JPjeMYc0"},
    ];

    var filtered = content.where((c) => _selectedCategory == 'All' || c['category'] == _selectedCategory).toList();

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text("Knowledge Hub", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
        const SizedBox(height: 8),
        const Text("Empower your healing journey with Ayurvedic wisdom.", style: TextStyle(color: Colors.grey)),
        const SizedBox(height: 24),

        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: categories.map((cat) => Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: ChoiceChip(
                label: Text(cat, style: TextStyle(color: _selectedCategory == cat ? Colors.white : Colors.black87)),
                selected: _selectedCategory == cat,
                selectedColor: ayurGreen,
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.grey.shade300)),
                showCheckmark: false,
                onSelected: (bool selected) => setState(() => _selectedCategory = cat),
              ),
            )).toList(),
          ),
        ),
        const SizedBox(height: 24),

        ...filtered.map((item) => Card(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey.shade200)),
          margin: const EdgeInsets.only(bottom: 16),
          child: InkWell(
            onTap: () async {
              final Uri url = Uri.parse(item['url']);
              if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not open link.')));
              }
            },
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    height: 80, width: 80,
                    decoration: BoxDecoration(color: item['color'].withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                    child: Icon(item['icon'], color: item['color'], size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)),
                          child: Text(item['category'], style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey.shade700)),
                        ),
                        const SizedBox(height: 8),
                        Text(item['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15), maxLines: 2, overflow: TextOverflow.ellipsis),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(item['type'] == 'Video' ? Icons.play_circle : Icons.article, size: 14, color: Colors.grey),
                            const SizedBox(width: 4),
                            Text("${item['type']} • ${item['time']}", style: const TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),
          ),
        )),
      ],
    );
  }

  // --- NEW DIGITAL HEALTH RECORDS TAB ---
  Widget _buildRecordsTab() {
    final completedAppts = _myAppointments.where((a) => a['status'] == 'Completed').toList();

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text("My Health Vault", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF064E3B))),
        const SizedBox(height: 8),
        const Text("Your past treatments, prescriptions, and health reports.", style: TextStyle(color: Colors.grey)),
        const SizedBox(height: 24),

        // Big Download Button
        InkWell(
          onTap: _generateAndSharePDF, // <--- Triggers the PDF build and share sheet
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [Colors.teal.shade700, ayurGreen]),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: ayurGreen.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5))],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
                  child: const Icon(Icons.picture_as_pdf, color: Colors.white, size: 30),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Download Health Record", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      SizedBox(height: 4),
                      Text("Export a PDF of your history and active prescriptions.", style: TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ),
                ),
                const Icon(Icons.download, color: Colors.white),
              ],
            ),
          ),
        ),
        
        const SizedBox(height: 32),
        
        const Text("Active Prescriptions", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        const SizedBox(height: 12),
        if (_dynamicMedicines.isEmpty) 
          const Padding(padding: EdgeInsets.all(20), child: Text("No active medicines.", style: TextStyle(color: Colors.grey)))
        else
          ..._dynamicMedicines.map((med) => ListTile(
            contentPadding: EdgeInsets.zero,
            leading: CircleAvatar(backgroundColor: Colors.blue.shade50, child: const Icon(Icons.medication, color: Colors.blue)),
            title: Text(med['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(med['time']),
          )),

        const Divider(height: 40),

        const Text("Past Treatments", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
        const SizedBox(height: 12),
        if (completedAppts.isEmpty) 
          const Padding(padding: EdgeInsets.all(20), child: Text("No completed treatments found.", style: TextStyle(color: Colors.grey)))
        else
          ...completedAppts.map((appt) => Card(
            elevation: 0,
            color: Colors.grey.shade50,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade200)),
            child: ListTile(
              leading: Icon(Icons.check_circle, color: Colors.green.shade400),
              title: Text(appt['therapyName'], style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(appt['scheduledDate']?.substring(0,10) ?? ''),
              trailing: const Icon(Icons.chevron_right, color: Colors.grey),
            ),
          )),
      ],
    );
  }

  Widget _buildChecklistItem(String text, IconData icon, Color color) {
    bool isChecked = false; 
    return StatefulBuilder(builder: (context, setCheckState) {
      return CheckboxListTile(
        value: isChecked,
        onChanged: (val) => setCheckState(() => isChecked = val!),
        title: Text(text, style: TextStyle(decoration: isChecked ? TextDecoration.lineThrough : null, color: isChecked ? Colors.grey : Colors.black87, fontSize: 14)),
        secondary: Icon(icon, color: isChecked ? Colors.grey : color, size: 20),
        activeColor: ayurGreen,
        contentPadding: EdgeInsets.zero,
        controlAffinity: ListTileControlAffinity.leading,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return Scaffold(body: Center(child: CircularProgressIndicator(color: ayurGreen)));

    // Handle 4 Tabs
    Widget bodyContent;
    switch (_currentIndex) {
      case 0: bodyContent = _buildHomeTab(); break;
      case 1: bodyContent = _buildTherapyPlanTab(); break;
      case 2: bodyContent = _buildRecordsTab(); break; // <--- NEW VAULT TAB
      case 3: bodyContent = _buildDiscoverTab(); break;
      default: bodyContent = _buildHomeTab();
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white, elevation: 0,
        title: const Text("AyurCare Portal", style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline, color: Color(0xFF10B981)),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatbotScreen())),
          ),
          IconButton(icon: const Icon(Icons.logout, color: Colors.redAccent), onPressed: _logout)
        ],
      ),
      body: bodyContent,
      
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: ayurGreen,
        unselectedItemColor: Colors.grey.shade400,
        type: BottomNavigationBarType.fixed, // <--- Required when having 4+ tabs
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"), 
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: "My Plan"),
          BottomNavigationBarItem(icon: Icon(Icons.folder_shared), label: "Records"), // <--- NEW ICON
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: "Discover"),
        ],
      ),
      floatingActionButton: _currentIndex == 0 ? FloatingActionButton.extended(
        onPressed: () => _showBookingDialog(),
        backgroundColor: ayurGreen,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Book Therapy", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ) : null,
    );
  }
}