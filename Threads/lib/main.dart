import 'package:flutter/material.dart';
import 'package:untitled/loginpass.dart';

void main() {
  runApp(ClothingApp());
}

class ClothingApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Threads!',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: LoginScreen(), // Update the home widget to LoginScreen()
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Threads: The Store of Comfort',
          style: TextStyle(fontFamily: 'Arial', fontWeight: FontWeight.bold),
        ),
      ),
      body: Container(
        color: Colors.teal, // Set background color to turquoise
        padding: EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome here customers!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Browse through our collection of school uniforms and more. We can\'t wait to serve you!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, fontFamily: 'Verdana'),
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => ClothingScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                primary: Colors.blue,
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              child: Text(
                'Click here to shop and explore',
                style: TextStyle(fontSize: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ClothingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Clothes - Browse',
          style: TextStyle(fontFamily: 'Arial', fontWeight: FontWeight.bold),
        ),
      ),
      body: Center(
        child: Text(
          'Browse Clothing Screen',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
