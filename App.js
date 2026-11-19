import { StatusBar } from 'expo-status-bar'; 
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native'; 
import axios from 'axios';

const GROQ_API_KEY = "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";

export default function App() { 
  const [ingredientes, setIngredientes] = useState('');
  const [receita, setReceita] = useState('Aguarde sua receita aparecer');

  const api = axios.create({
    baseURL: 'https://api.groq.com/openai/v1',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
  });

  async function gerarReceita() {
    if (!ingredientes.trim()) {
      alert("Por favor, digite os ingredientes antes!");
      return;
    }

    setReceita("Chefe pensando na sua receita... 🧑‍🍳⏳");

    try {
       const resposta = await api.post('/chat/completions', {
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `Você é um chef criativo. Crie receitas simples e deliciosas com os ingredientes fornecidos pelo usuário. Responda estritamente em português do Brasil.

Use este formato:
🍳 [NOME DA RECEITA EM MAIÚSCULO]

⏱️ Tempo: [tempo de preparo]
👥 Porções: [quantidade]

📝 INGREDIENTES:
. [ingrediente 1]
. [ingrediente 2]
. [etc]

🧑‍🍳 MODO DE PREPARO:
1. [passo 1]
2. [passo 2]
3. [etc]

💡 DICA: [uma dica especial sobre a receita]`
          },
          {
            role: 'user',
            content: `Crie uma receita com esses ingredientes: ${ingredientes}`
          }
        ],
        temperature: 1,
        max_tokens: 1024
      });

      
      const textoReceita = resposta.data.choices?.[0]?.message?.content;
      if (textoReceita) {
        setReceita(textoReceita);
      } else {
        setReceita("Não foi possível processar a resposta da IA.");
      }

    } catch (error) {
      
      console.log("Erro completo da API:", error.response?.data || error.message);
      setReceita("Ops! Não foi possível gerar a receita. Verifique sua conexão e tente novamente.");
    }
  } 

  return ( 
    <View style={styles.screenContainer}>
      <StatusBar style="light" /> 

      {/* Header */} 
      <View style={styles.header}> 
        <Text style={styles.logoEmoji}>🧑‍🍳</Text> 
        <Text style={styles.title}>Chef IA</Text> 
        <Text style={styles.subtitle}>Digite os ingredientes que você tem</Text> 
      </View> 

      {/* Input */} 
      <TextInput 
        style={styles.input}
        placeholder='Ex: Carne, Legumes, Grãos....' 
        multiline 
        placeholderTextColor="#888" 
        value={ingredientes}
        onChangeText={setIngredientes}
      /> 

      {/* Botão */} 
      <TouchableOpacity 
        style={styles.button}
        onPress={gerarReceita}
      > 
        <Text style={styles.buttonText}>Gerar Receita</Text> 
      </TouchableOpacity> 

      {/* Receita */} 
      <ScrollView style={styles.recipeContainer} contentContainerStyle={styles.recipeContent}> 
        <Text style={styles.recipeEmoji}>🍲</Text> 
        <Text style={styles.recipeText}>{receita}</Text>
      </ScrollView> 
    </View>
  ); 
} 

const styles = StyleSheet.create({ 
  screenContainer: {
    flex: 1, 
    backgroundColor: '#1a1a2e', 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
  },
  header: { 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingBottom: 20,
  },
  logoEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e17055',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeContainer: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 15,
    padding: 15,
  },
  recipeContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  recipeEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  recipeText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    width: '100%',
  }
});