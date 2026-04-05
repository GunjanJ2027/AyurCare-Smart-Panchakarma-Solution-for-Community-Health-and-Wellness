import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DoshaQuiz extends StatefulWidget {
  const DoshaQuiz({super.key});

  @override
  _DoshaQuizState createState() => _DoshaQuizState();
}

class _DoshaQuizState extends State<DoshaQuiz> {
  final _storage = const FlutterSecureStorage();
  int _currentQuestion = 0;
  Map<String, int> scores = {'Vata': 0, 'Pitta': 0, 'Kapha': 0};

  final List<Map<String, dynamic>> _questions = [
    {
      'q': 'My body frame is...',
      'a': [
        {'text': 'Thin, bony, or tall', 'type': 'Vata'},
        {'text': 'Medium, athletic, or muscular', 'type': 'Pitta'},
        {'text': 'Large, broad, or thick', 'type': 'Kapha'},
      ]
    },
    {
      'q': 'My digestion is usually...',
      'a': [
        {'text': 'Irregular or prone to bloating', 'type': 'Vata'},
        {'text': 'Strong, I get hungry often', 'type': 'Pitta'},
        {'text': 'Slow, I feel heavy after meals', 'type': 'Kapha'},
      ]
    },
    {
      'q': 'My skin is mostly...',
      'a': [
        {'text': 'Dry, rough, or cold', 'type': 'Vata'},
        {'text': 'Warm, sensitive, or oily', 'type': 'Pitta'},
        {'text': 'Soft, thick, or moist', 'type': 'Kapha'},
      ]
    }
  ];

  void _submitDosha(String finalDosha) async {
    final token = await _storage.read(key: 'token');
    await http.post(
      Uri.parse('http://localhost:5000/api/patient/update-dosha'),
      headers: {'Content-Type': 'application/json', 'x-auth-token': token ?? ''},
      body: jsonEncode({'dosha': finalDosha}),
    );
    Navigator.pop(context, true); // Return true to refresh home
  }

  @override
  Widget build(BuildContext context) {
    var q = _questions[_currentQuestion];
    return Scaffold(
      appBar: AppBar(title: const Text("Prakriti Assessment")),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(value: (_currentQuestion + 1) / _questions.length),
            const SizedBox(height: 32),
            Text(q['q'], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ...q['a'].map<Widget>((ans) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 60)),
                onPressed: () {
                  scores[ans['type']] = scores[ans['type']]! + 1;
                  if (_currentQuestion < _questions.length - 1) {
                    setState(() => _currentQuestion++);
                  } else {
                    // Calculate Result
                    String result = scores.entries.reduce((a, b) => a.value > b.value ? a : b).key;
                    _submitDosha(result);
                  }
                },
                child: Text(ans['text']),
              ),
            )).toList(),
          ],
        ),
      ),
    );
  }
}