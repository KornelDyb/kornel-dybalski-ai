# Formularz → Make → HubSpot → Gmail: krok po kroku

Formularz wysyła dane do funkcji na Netlify (`/api/lead`), ta sprawdza je jeszcze raz i przekazuje do webhooka Make.
Make dostaje taki JSON:

```json
{ "name": "Anna", "email": "anna@firma.pl", "company": "Firma", "size": "5-20",
  "message": "…", "consent": true, "honeypot": "", "source": "strona-formularz",
  "submitted_at": "2026-10-30T12:00:00.000Z" }
```

## 0. Konta (raz)
- Make (plan Free), HubSpot (Free CRM), Google (Gmail + Kalendarz).
- W Google Calendar utwórz **Harmonogram spotkań** (Utwórz → Harmonogram spotkań): 30 minut, Twoje godziny, wideo Google Meet. Skopiuj link do strony rezerwacji.

## 1. Webhook (zadanie 6)
1. Make → **Create a new scenario** → kliknij plus → **Webhooks** → **Custom webhook** → **Add** → nazwa `Formularz strona` → **Save**.
2. Skopiuj adres webhooka.
3. Netlify → Twoja strona → **Site configuration → Environment variables → Add a variable**: klucz `MAKE_WEBHOOK_URL`, wartość: skopiowany adres. Potem **Deploys → Trigger deploy**.
4. W Make kliknij **Run once**, wyślij formularz na stronie. Make pokaże „Successfully determined”, a struktura danych zostanie zapamiętana. To jest kryterium zadania 6.

## 2. Filtr na boty
Kliknij linię za webhookiem → **Set up a filter**: nazwa `Nie bot`, warunek `honeypot` → **Text operators: Equal to** → zostaw puste. (Strona i tak odsiewa boty, to druga linia obrony.)

## 3. HubSpot (zadanie 7)
1. Plus → **HubSpot CRM** → **Create/Update a Contact** (połącz konto): Email = `email`, First name = `name`, Company name = `company`, Message = `message`.
   Wielkość firmy: w HubSpot dodaj własne pole kontaktu `wielkosc_firmy` (Settings → Properties) i zmapuj na `size`.
2. Plus → **HubSpot CRM** → **Create a Deal**: Deal name = `{{company}}, formularz`, Pipeline = Sales Pipeline, Stage = utwórz etap **Nowy lead** i go wybierz, Associations → Contact = ID kontaktu z kroku 1.

## 4. Maile (zadanie 8)
1. Plus → **Gmail** → **Send an email** (połącz konto Google; przy koncie @gmail.com Make może poprosić o własnego klienta OAuth w Google Cloud, instrukcja jest w oknie łączenia).
   - To: `email`, Subject: `Kornel, odpowiedź na Twoje zgłoszenie`
   - Treść (po ludzku, krótko):
     > Cześć {{name}},
     >
     > dzięki za wiadomość. Wybierz termin 30-minutowej rozmowy, który Ci pasuje: [link do harmonogramu spotkań].
     > Przed rozmową przemyślę to, co napisałeś o {{company}}.
     >
     > Do usłyszenia,
     > Kornel
2. Plus → **Gmail** → **Send an email** do siebie: Subject `Nowy lead: {{company}} ({{size}})`, treść: imię, mail, wiadomość, link do kontaktu w HubSpot.

## 5. Włączenie
**Save** → przełącznik **Scheduling** na ON (Immediately). Wyślij 3 testowe zgłoszenia z telefonu i komputera i zmierz czas do maila (zadanie 10). Cel: poniżej 2 minut.

## Po co ta kolejność
Najpierw zapis w CRM, potem maile: jeśli Gmail kiedyś zawiedzie, kontakt i tak jest w HubSpot i nic nie ginie.
W planie Free każde zgłoszenie zużywa ok. 6 operacji (webhook, filtr, 2 × HubSpot, 2 × Gmail), czyli ok. 150 zgłoszeń miesięcznie.
