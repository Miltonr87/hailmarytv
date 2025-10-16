# 🧩 SonarQube Local Setup Guide

This guide explains how to integrate **SonarQube** with your local environment for code quality and coverage analysis in your **HailMaryTV** project.

---

## 🐋 1. Run SonarQube Locally (Recommended via Docker)

Start a SonarQube instance using Docker:

```bash
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:latest
```

Then open your browser at:

👉 **http://localhost:9000**

Default credentials:

```
Username: admin
Password: admin
```

---

## 💻 2. Manual Installation (Alternative)

If you prefer not to use Docker:

1. Download SonarQube from [SonarQube Downloads](https://www.sonarsource.com/products/sonarqube/downloads/)
2. Extract the archive
3. Start the service:
   ```bash
   ./bin/linux-x86-64/sonar.sh start
   ```
4. Access **http://localhost:9000**

---

## ⚙️ 3. Add Sonar Scanner

Install the CLI scanner globally:

```bash
npm install -g sonar-scanner
```

Or locally for your project:

```bash
npm install -D sonar-scanner
```

---

## 🧾 4. Create `sonar-project.properties`

At your project root, add:

```properties
sonar.projectKey=hailmarytv
sonar.projectName=HailMaryTV
sonar.projectVersion=1.0
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.sourceEncoding=UTF-8
sonar.exclusions=src/components/ui/**,src/**/*.d.ts,src/components/ui/sidebar/sidebar.tsx
```

This configuration excludes **Shadcn/UI primitives** and other boilerplate files from the analysis.

---

## 🚀 5. Run the Analysis

After running your Jest tests with coverage:

```bash
npm test -- --coverage
```

Run SonarQube analysis:

```bash
sonar-scanner -Dsonar.login=admin -Dsonar.password=admin
```

or

```bash
npm run sonar
```

You’ll then see your report in:

👉 **http://localhost:9000/dashboard?id=hailmarytv**

---

## 🧠 6. Optional — CI/CD Integration

Once your local setup is working, you can extend SonarQube to CI pipelines:

- **GitHub Actions**, **GitLab CI**, or **Jenkins**
- Or connect to **SonarCloud** for cloud-based quality reports

---

✅ With this setup, you’ll have local insights into code quality, maintainability, and test coverage keeping production-grade.
